import { PrismaClient } from '@prisma/client';
import { hasValidSubscription } from '../utils/subscriptionAccess.js';
const prisma = new PrismaClient();
const owner = (businessId, userId) => prisma.business.findFirst({where:{id:businessId,userId},include:{subscription:true}});
const replyError = (res,error) => {console.error(error);return res.status(500).json({message:'Billing request failed.'});};
export async function getCheckoutCapabilities(req,res){
 const business=await owner(req.params.businessId,req.user.userId).catch(e=>null);
 if(!business)return res.status(404).json({message:'Business not found'});
 return res.json({mode:'PREVIEW',methods:[{id:'card',label:'Credit or debit card',enabled:false},{id:'apple_pay',label:'Apple Pay',enabled:false},{id:'google_pay',label:'Google Pay',enabled:false},{id:'thawani',label:'Thawani',enabled:false}],cardFieldsHostedByProvider:true,trialActivationAvailable:false});
}
export async function getPaymentMethods(req,res){
 try {const business=await owner(req.params.businessId,req.user.userId);if(!business)return res.status(404).json({message:'Business not found'});
 const paymentMethods=await prisma.paymentMethod.findMany({where:{businessId:business.id},select:{id:true,brand:true,last4:true,expiryMonth:true,expiryYear:true,isDefault:true},orderBy:{createdAt:'desc'}});
 return res.json({paymentMethods});}catch(e){return replyError(res,e)}
}
export async function getBillingHistory(req,res){
 try {const business=await owner(req.params.businessId,req.user.userId);if(!business)return res.status(404).json({message:'Business not found'});
 const transactions=await prisma.billingTransaction.findMany({where:{businessId:business.id},select:{id:true,amount:true,currency:true,status:true,createdAt:true},orderBy:{createdAt:'desc'},take:50});
 return res.json({transactions:transactions.map(t=>({...t,amount:t.amount.toString()}))});}catch(e){return replyError(res,e)}
}
export async function cancelAtPeriodEnd(req,res){
 try {const business=await owner(req.params.businessId,req.user.userId);if(!business)return res.status(404).json({message:'Business not found'});
 const s=business.subscription; if(!s||!hasValidSubscription(s))return res.status(409).json({message:'No current trial or paid entitlement to cancel.'});
 // Provider-managed recurring billing must be cancelled with provider before this endpoint is enabled for live payments.
 if(s.providerSubscriptionId)return res.status(409).json({message:'Provider cancellation integration is required before changing this subscription.'});
 const subscription=await prisma.subscription.update({where:{businessId:business.id},data:{cancelAtPeriodEnd:true,pendingPlanId:null,pendingPlanPriceId:null,planChangeAt:null,nextBillingAt:null}});
 return res.json({message:'Cancellation scheduled. Access remains until the current period ends.',subscription});}catch(e){return replyError(res,e)}
}
export async function resumeRenewal(req,res){
 try {const business=await owner(req.params.businessId,req.user.userId);if(!business)return res.status(404).json({message:'Business not found'});
 const s=business.subscription;if(!s||!hasValidSubscription(s)||!s.cancelAtPeriodEnd)return res.status(409).json({message:'No pending cancellation.'});
 if(s.providerSubscriptionId)return res.status(409).json({message:'Provider renewal integration is required.'});
 // This only withdraws cancellation preference. It never authorizes a payment or renews access.
 const subscription=await prisma.subscription.update({where:{businessId:business.id},data:{cancelAtPeriodEnd:false}});
 return res.json({message:'Cancellation preference removed. Payment integration is still required for renewal.',subscription});}catch(e){return replyError(res,e)}
}
export async function schedulePlanChange(req,res){
 try {const business=await owner(req.params.businessId,req.user.userId);if(!business)return res.status(404).json({message:'Business not found'});
 const s=business.subscription;if(!s||!hasValidSubscription(s))return res.status(409).json({message:'An active entitlement is required.'});
 if(s.cancelAtPeriodEnd)return res.status(409).json({message:'Remove scheduled cancellation before changing plans.'});
 if(s.providerSubscriptionId)return res.status(409).json({message:'Provider plan-change integration is required.'});
 const {planId}=req.body;if(typeof planId!=='string')return res.status(400).json({message:'planId is required'});
 const plan=await prisma.subscriptionPlan.findFirst({where:{id:planId,isActive:true},include:{prices:{orderBy:{version:'desc'},take:1}}});
 if(!plan||!plan.prices.length||!['MONTHLY','YEARLY'].includes(plan.name.toUpperCase()))return res.status(400).json({message:'Plan unavailable'});
 if(s.subscriptionPlanId===plan.id)return res.status(409).json({message:'This is already your current plan.'});
 const boundary=s.status==='TRIALING'?s.trialEndsAt:s.currentPeriodEnd;
 const subscription=await prisma.subscription.update({where:{businessId:business.id},data:{pendingPlanId:plan.id,pendingPlanPriceId:plan.prices[0].id,planChangeAt:boundary}});
 return res.json({message:'Plan preference scheduled for the period boundary. No charge or new entitlement is created.',subscription});}catch(e){return replyError(res,e)}
}
export async function clearScheduledPlanChange(req,res){
 try {const business=await owner(req.params.businessId,req.user.userId);if(!business)return res.status(404).json({message:'Business not found'});
 const subscription=await prisma.subscription.update({where:{businessId:business.id},data:{pendingPlanId:null,pendingPlanPriceId:null,planChangeAt:null}});
 return res.json({message:'Scheduled plan preference cleared.',subscription});}catch(e){return replyError(res,e)}
}

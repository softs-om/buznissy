const ROOT_DOMAIN = "buznissy.com";

const RESERVED_NAMES = new Set([
  "www",
  "api",
  "admin",
  "app",
  "mail",
  "support",
  "help",
  "billing",
  "dashboard",
  "login",
  "signup",
  "account",
  "static",
  "assets",
  "cdn",
  "dev",
]);

export const generateSubdomain = (name) => {
  const slug = String(name)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 45)
    .replace(/-+$/g, "");

  if (!slug || RESERVED_NAMES.has(slug)) {
    return "store";
  }

  return slug;
};

export const reserveBusinessSubdomain = async (
  prisma,
  businessId,
  businessName,
) => {
  const existing = await prisma.domain.findFirst({
    where: { businessId, type: "SUBDOMAIN" },
  });

  if (existing) return existing;

  const base = generateSubdomain(businessName);

  for (let attempt = 0; attempt < 20; attempt++) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const label = `${base.slice(0, 63 - suffix.length)}${suffix}`;
    const hostname = `${label}.${ROOT_DOMAIN}`;

    try {
      return await prisma.domain.create({
        data: {
          businessId,
          hostname,
          type: "SUBDOMAIN",
          status: "PENDING",
          isPrimary: true,
        },
      });
    } catch (error) {
      if (error.code !== "P2002") throw error;

      // Another request may have reserved this business's domain.
      const alreadyReserved = await prisma.domain.findFirst({
        where: { businessId, type: "SUBDOMAIN" },
      });

      if (alreadyReserved) return alreadyReserved;
    }
  }

  throw new Error("Could not reserve an available subdomain");
};

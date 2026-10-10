import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "OWNER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    return res.status(201).json({
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Unable to create account",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in",
    });
  }
};

// Updates the signed-in user's display name. Email is intentionally not
// editable here: it is the login identity shared with the website.
export const updateProfile = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (name.length > 100) {
      return res
        .status(400)
        .json({ message: "Name must be 100 characters or fewer" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Unable to update profile",
    });
  }
};

// Changes the signed-in user's password after verifying the current one.
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!currentMatches) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from the current one",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Unable to change password",
    });
  }
};

// Changes the signed-in user's login email. The email is the identity shared
// with the website (OTP login), so the current password is required, the
// address is validated, and it must not belong to another account.
export const changeEmail = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const { currentPassword } = req.body;

    if (!email || !currentPassword) {
      return res.status(400).json({
        message: "New email and current password are required",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length > 254 || !emailPattern.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    if (user.email === email) {
      return res.status(400).json({
        message: "This is already your email",
      });
    }

    const emailTaken = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        NOT: { id: user.id },
      },
    });

    if (emailTaken) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      // The new address has not been verified yet.
      data: { email, emailVerified: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "Email updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Two requests racing for the same address hit the unique index.
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error("Change email error:", error);

    return res.status(500).json({
      message: "Unable to update email",
    });
  }
};
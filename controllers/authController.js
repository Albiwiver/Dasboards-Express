const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");
const { sendResetPasswordEmail } = require("../services/emailService");

exports.register = async (req, res, next) => {
  try {
    const { name, email, lastName, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(
        res,
        400,
        "MISSING_FIELDS",
        "Todos los campos son obligatorios"
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(
        res,
        409,
        "EMAIL_ALREADY_EXISTS",
        "El correo ya está registrado"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return successResponse(
      res,
      201,
      "Usuario registrado y autenticado correctamente",
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        "MISSING_FIELDS",
        "Email y contraseña requeridos"
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Credenciales inválidas"
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return errorResponse(
        res,
        401,
        "INVALID_CREDENTIALS",
        "Credenciales inválidas"
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return successResponse(res, 200, "Login exitoso", {
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(
        res,
        400,
        "MISSING_FIELDS",
        "El email es obligatorio"
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "USER_NOT_FOUND", "Usuario no encontrado");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 1000 * 60 * 15; // 15 minutos

    user.resetToken = resetToken;
    user.resetTokenExpiration = expiration;
    await user.save();

    const previewUrl = await sendResetPasswordEmail(user.email, resetToken);

    return successResponse(res, 200, "Correo de recuperación enviado", {
      previewUrl,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return errorResponse(
        res,
        400,
        "MISSING_FIELDS",
        "Token y nueva contraseña requeridos"
      );
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(
        res,
        400,
        "INVALID_TOKEN",
        "Token inválido o expirado"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    return successResponse(res, 200, "Contraseña actualizada correctamente");
  } catch (error) {
    next(error);
  }
};

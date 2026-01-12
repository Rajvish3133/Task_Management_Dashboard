import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) { 
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    const token = newUser.generateToken();
    await newUser.save();

    res.status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = user.generateToken();

    res.status(200)
      .cookie("token", token, {
        httpOnly: true,
         secure: true,        
         sameSite: "none", 
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

export const logoutUser = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(0) })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

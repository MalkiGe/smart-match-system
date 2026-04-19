const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
  
    // בסיס משתמש
   
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    tribe: {
      type: String,
      enum: ["Ashkenazi", "Sephardi", "Temani", "Other"],
    },

    style: {
      type: String,
      enum: ["modest", "classic", "open"],
    },

    height: {
      type: Number,
    },

    appearance: {
      type: String,
      enum: ["thin", "classic", "full", "heavy"],
    },

    description: {
      type: String,
    },

    
    // שדות לפי מגדר
   
    seminary: {
      type: String, // לבנות
    },

    occupation: {
      type: String, // לבנות
    },

    yeshiva: {
      type: String, // לבנים
    },

    budget: {
      type: Number, // לבנים/דרישות כספיות
    },

    
    //  קבצים (רק למנהל!)
    
    resumePdf: {
      type: String,
    },

    image: {
      type: String, 
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    
    //  דרישות מבן/בת זוג
    
    preferences: {
      ageMin: Number,
      ageMax: Number,

      style: {
        type: String,
        enum: ["modest", "classic", "open"],
      },

      tribe: {
        type: String,
        enum: ["Ashkenazi", "Sephardi", "Temani", "Other"],
      },

      appearance: {
        type: String,
        enum: ["thin", "classic", "full", "heavy"],
      },

      heightMin: Number,
      heightMax: Number,
    },

    // מערכת התאמות עתידית
    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
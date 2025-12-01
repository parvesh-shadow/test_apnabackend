const mongoose = require("mongoose");

// Sub-schemas for better organization
const ListItemSchema = new mongoose.Schema(
  {
    icon: String, // File path or URL
    text: String,
  },
  { _id: false }
);

const HighlightSchema = new mongoose.Schema(
  {
    image: String,
    text: String,
  },
  { _id: false }
);

const PropertySchema = new mongoose.Schema(
  {
    plotSize: Number,
    priceRange: Number,
    status: {
      type: String,
      default: "",
    },
    bookingAmount: Number,
  },
  { _id: false }
);

const AmenitySchema = new mongoose.Schema(
  {
    icon: String,
    text: String,
  },
  { _id: false }
);

const TestimonialSchema = new mongoose.Schema(
  {
    testimonialUrl: String,
    text: String,
  },
  { _id: false }
);

const VideoSchema = new mongoose.Schema(
  {
    link: String,
    text: String,
  },
  { _id: false }
);

const FAQSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

// Main Project Schema
const ProjectSchema = new mongoose.Schema(
  {
    // Hero Section
    hero: {
      include: { type: Boolean, default: false },
      heading: String,
      paragraph: String,
      nestedHeading: String,
      nestedParagraph: String,
      listItems: [ListItemSchema],
      includeInputSection: { type: Boolean, default: false },
      sold: { type: Boolean, default: false },
      heroSectionVideoUrl: String,
    },

    // About Section
    about: {
      include: { type: Boolean, default: false },
      heading: String,
      paragraph: String,
      images: [String], // Array of image URLs/paths
    },

    // Highlight Section
    highlight: {
      include: { type: Boolean, default: false },
      heading: String,
      highlights: [HighlightSchema],
    },

    // Property Section
    property: {
      include: { type: Boolean, default: false },
      heading: String,
      properties: [PropertySchema],
    },

    // Video Section
    video: {
      include: { type: Boolean, default: false },
      heading: String,
      nestedHeading: String,
      paragraph: String,
      videos: [VideoSchema],
      includeInputSection: { type: Boolean, default: false },
    },

    // Gallery Section
    gallery: {
      include: { type: Boolean, default: false },
      heading: String,
      images: [String],
    },

    // Amenities Section
    amenities: {
      include: { type: Boolean, default: false },
      heading: String,
      paragraph: String,
      amenities: [AmenitySchema],
    },
    perfectLocation: {
      include: { type: Boolean, default: false },
      map: String,
      heading: String,
      nestedHeading: String,
      address: String,
    },
    // Testimonial Section
    testimonial: {
      include: { type: Boolean, default: false },
      heading: String,
      testimonials: [TestimonialSchema],
    },
    //News highlight
    NewsHighlight: {
      include: { type: Boolean, default: false },
      heading: String,
      images: [String],
    },
    // FAQ Sections
    faq: {
      include: { type: Boolean, default: false },
      heading: String,
      faqs: [FAQSchema],
    },
    // Contact Section
    contact: {
      include: { type: Boolean, default: false },
      heading: String,
      description: String,
      address: String,
    },
    SEO: {
      title: String,
      metaDescription: String,
      canonical: String,
      robots: String,
      ogTitle: String,
      ogDescription: String,
      scripts: [String],
      slug: String,
    },
    status: {
      type: String,
      default: "draft",
    },
    pageId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);

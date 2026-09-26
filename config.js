/**
 * ============================================================
 *  SITE CONFIGURATION — EDIT THIS FILE TO REBRAND THE SITE
 *  All business details, products, story, theme & SEO live here.
 *  No other files need to be modified for a standard rebrand.
 * ============================================================
 */
var SITE_CONFIG = {

  // ── Business Details ──────────────────────────────────────
  business: {
    name:      "Ceyri Spice Products",
    tagline:   "Pure Ceylon. Pure Flavour. Pure Heritage.",
    logo:      "assets/images/logo.jpg",                          // e.g. "assets/images/logo.png"
    address:   "No. 42, Spice Garden Lane, Matale 21000, Sri Lanka",
    phone:     "+94 66 222 3456",
    email:     "ceyrispiceproducts@gmail.com",
    whatsapp:  "94662223456",                 // digits only — used in wa.me/... link
    formspree: "https://formspree.io/f/mzezjkdp",
  },

  // ── Theme Colors (all sections auto-update) ───────────────
  // Delete a key to keep the default value defined in main.css
  theme: {
    primaryColor:   "#8B1A1A",   // Deep Chilli Red
    secondaryColor: "#C97B2B",   // Turmeric Gold
    accentColor:    "#2D6A4F",   // Cardamom Green
    earthColor:     "#5C3D2E",   // Cinnamon Brown
    creamColor:     "#FDF6EC",   // Coconut Cream
    darkColor:      "#1A0F0A",   // Dark Roast
  },

  // ── Hero Carousel ─────────────────────────────────────────
  hero: {
    slides: [
      {
        image:      "assets/images/hero1.jpg",
        heading:    "From the Heart of Ceylon",
        subheading: "Authentic Sri Lankan spices, sourced straight from the island paradise and shipped worldwide.",
        cta:        "Explore Our Spices",
      },
      {
        image:      "assets/images/hero2.jpg",
        heading:    "Premium Quality, Guaranteed",
        subheading: "ISO certified exports trusted by buyers in over 35 countries across the globe.",
        cta:        "View Our Products",
      },
      {
        image:      "assets/images/hero3.jpg",
        heading:    "Nature's Finest Harvest",
        subheading: "Hand-picked, sun-dried, and carefully processed for maximum potency and purity.",
        cta:        "Why Us",
      },
    ],
  },

  // ── Stats Bar (Removed) ───────────────────────────────────
  stats: [],

  // ── Products ──────────────────────────────────────────────
  products: [
    {
      id:          "ceylon-cinnamon",
      name:        "Ceylon True Cinnamon",
      category:    "Premium Spice",
      image:       "assets/images/product_cinnamon.jpg",
      description: "The world's finest cinnamon, grown in the forests of Sri Lanka. Lighter, sweeter, and more delicate than cassia — prized by top chefs worldwide.",
      origin:      "Kandy & Matale Districts",
      available:   ["Whole Quills", "Powder", "Chips", "Oil"],
    },
    {
      id:          "black-pepper",
      name:        "Ceylon Black Pepper",
      category:    "Premium Spice",
      image:       "assets/images/product_pepper.jpg",
      description: "Bold, aromatic, and intensely flavoured. Our black pepper is harvested at peak maturity for maximum pungency and freshness.",
      origin:      "Kandy & Matara Districts",
      available:   ["Whole", "Cracked", "Ground", "Oil"],
    },
    {
      id:          "cardamom",
      name:        "Green Cardamom",
      category:    "Aromatic Spice",
      image:       "assets/images/product_cardamom.jpg",
      description: "The 'Queen of Spices' — intensely aromatic with warm, sweet notes. Perfect for both savoury and sweet culinary applications.",
      origin:      "Uva & Sabaragamuwa Provinces",
      available:   ["Whole Pods", "Seeds", "Powder"],
    },
    {
      id:          "cloves",
      name:        "Ceylon Cloves",
      category:    "Aromatic Spice",
      image:       "assets/images/product_cloves.jpg",
      description: "Rich, warm, and intensely aromatic. Our cloves boast high eugenol content, making them ideal for culinary and medicinal use alike.",
      origin:      "Colombo & Gampaha Districts",
      available:   ["Whole", "Ground", "Oil"],
    },
    {
      id:          "turmeric",
      name:        "Ceylon Turmeric",
      category:    "Root Spice",
      image:       "assets/images/product_turmeric.jpg",
      description: "Vibrant golden turmeric with exceptionally high curcumin content. A powerhouse of flavour and proven wellness benefits.",
      origin:      "Polonnaruwa & Kurunegala Districts",
      available:   ["Fresh Root", "Dried Fingers", "Powder"],
    },
    {
      id:          "nutmeg",
      name:        "Ceylon Nutmeg",
      category:    "Exotic Spice",
      image:       "assets/images/product_nutmeg.jpg",
      description: "Warm, spicy, and richly fragrant. Ceylon nutmeg is prized by chefs worldwide for its superior aroma and layered flavour profile.",
      origin:      "Southern Province",
      available:   ["Whole", "Ground", "Mace", "Oil"],
    },
  ],

  // ── Certifications Bar ────────────────────────────────────
  // certifications: [
  // ],

  // ── Why Choose Us ─────────────────────────────────────────
  story: {
    heading:    "Why Partner With Us?",
    subheading: "Uncompromising Quality & Direct Sourcing",
    image:      "assets/images/story_image.jpg",
    body: [
      "As a newly established, dynamic export house, our agility is our greatest strength. We source our spices directly from carefully selected local farmers across Sri Lanka, ensuring you get the freshest harvest while supporting sustainable agricultural practices.",
      "We meticulously handpick, sort, and process our spices under strict quality controls to meet global export standards. Our streamlined operations mean we can offer highly competitive pricing without ever compromising on purity or flavour.",
      "Whether you need bulk shipments or customized retail packaging, we are dedicated to providing personalized service, prompt delivery, and the authentic taste of Ceylon straight to your doorstep."
    ],
  },

  // ── Social Media ──────────────────────────────────────────
  social: {
    facebook:  "https://facebook.com/Ceyri-Spice-Products-103965572481698",
    instagram: "https://instagram.com/ceyrispiceproducts",
    linkedin:  "https://linkedin.com/company/ceyrispiceproducts",
  },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    copyright: "Ceyri (Pvt) Ltd",
    tagline:   "Connecting the World to Ceylon's Finest Flavours",
  },

  // ── SEO (auto-applied to <head>) ──────────────────────────
  seo: {
    title:       "Ceyri — Premium Sri Lankan Spice Exports",
    description: "Export-quality Ceylon spices sourced directly from Sri Lanka. Cinnamon, pepper, cardamom, cloves, turmeric and more shipped worldwide.",
    keywords:    "Ceylon cinnamon, Sri Lankan spices, spice export, black pepper, cardamom, cloves, turmeric, nutmeg, Sri Lanka",
    ogImage:     "assets/images/hero2.jpg",
  },
};

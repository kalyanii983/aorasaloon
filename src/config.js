// Central business info. Items marked CONFIRM need client sign-off before launch.
export const SITE = {
  name: 'Aora Luxe',
  domain: 'https://YOUR-DOMAIN.com', // CONFIRM: also update public/sitemap.xml, robots.txt
  phone: '+91 96861 35502', tel: 'tel:+919686135502', wa: '919686135502',
  address: 'No. 102, Thirumenahalli, Markandaiah Nagar, Yelahanka, Bengaluru – 560064', // CONFIRM spelling
  landmark: 'Opposite Antalea Homes / Villas', // CONFIRM spelling
  hours: '9:00 AM – 9:00 PM, Monday to Sunday',
  instagram: '', // add when supplied
  mapQuery: 'Aora Luxe Thirumenahalli Yelahanka Bengaluru 560064', // CONFIRM pin
}
export const waLink = (msg = 'Hello Aora Luxe, I would like to enquire about your salon services and appointment availability.') =>
  `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`
export const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`

// Full service list – each service gets its own detail page at /services/<slug>
// Drop service photos in /public/services/<slug>.jpg  (or .png / .webp)
export const SERVICES = [
  {
    slug: 'hair',
    title: 'Hair Services',
    img: 'hair',
    blurb: 'From precision cuts to global colour transformations — every hair service is shaped around your texture, face and lifestyle.',
    points: [
      'Haircut for Men & Women',
      'Hair Styling & Blow Dry',
      'Hair Wash & Conditioning',
      'Hair Spa & Deep Conditioning',
      'Hair Smoothening',
      'Keratin Treatment',
      'Hair Straightening',
      'Hair Rebonding',
      'Hair Colouring & Global Colour',
      'Root Touch-Up',
      'Highlights & Balayage',
      'Hair Botox Treatment',
    ],
  },
  {
    slug: 'mens-grooming',
    title: "Men's Grooming",
    img: 'mens',
    blurb: 'Sharp cuts, clean fades and tailored grooming — designed for the modern man who values precision.',
    points: [
      "Men's Haircut",
      'Beard Trimming & Styling',
      'Shaving',
      'Hair Colour',
      'Hair Spa',
      'Facial & Cleanup',
      'Head Massage',
    ],
  },
  {
    slug: 'skin-care',
    title: 'Skin Care & Facial',
    img: 'beauty',
    blurb: 'Radiant, healthy skin starts here. Our facials and treatments are customised to your skin type for visible results.',
    points: [
      'Classic Facial',
      'Premium & Luxury Facial',
      'Hydrating Facial',
      'Anti-Ageing Facial',
      'Cleanup',
      'Detan Treatment',
      'Face Bleach',
      'Face & Neck Polishing',
    ],
  },
  {
    slug: 'nail-services',
    title: 'Nail Services',
    img: 'nails',
    blurb: 'From classic manicures to intricate nail art — express your style down to the fingertips.',
    points: [
      'Manicure',
      'Pedicure',
      'Gel Nail Polish',
      'Nail Extensions',
      'Nail Art',
      'Nail Removal',
    ],
  },
  {
    slug: 'makeup-bridal',
    title: 'Makeup & Bridal',
    img: 'makeup',
    blurb: 'Flawless makeup for every occasion — from soft party glam to breathtaking bridal looks that last all day.',
    points: [
      'Party Makeup',
      'Engagement Makeup',
      'Bridal Makeup',
      'Reception Makeup',
      'Hairstyling for Special Occasions',
      'Saree Draping',
    ],
  },
  {
    slug: 'waxing-threading',
    title: 'Waxing & Threading',
    img: 'waxing',
    blurb: 'Smooth, hair-free skin with gentle techniques — because comfort and hygiene are never negotiable.',
    points: [
      'Full Body Waxing',
      'Rica Wax',
      'Arms & Legs Waxing',
      'Underarm Waxing',
      'Full Face Waxing',
      'Eyebrow Threading',
      'Upper Lip & Chin Threading',
    ],
  },
  {
    slug: 'massage-relaxation',
    title: 'Massage & Relaxation',
    img: 'massage',
    blurb: 'Unwind with therapeutic massages designed to melt away stress and leave you feeling completely renewed.',
    points: [
      'Head Massage',
      'Hair Oil Massage',
      'Neck & Shoulder Massage',
      'Relaxation Treatments',
    ],
  },
]

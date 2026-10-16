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

// CONFIRM the service list with the client. Drop photos in /public/images/<img>.jpg
export const SERVICES = [
  { slug:'hair', title:'Hair Styling & Colour', img:'hair', blurb:'Cuts, styling, colour and treatments shaped around you.', points:['Haircuts and styling','Hair colouring','Hair treatments','Unisex grooming'] },
  { slug:'beauty', title:'Beauty & Skincare', img:'beauty', blurb:'Restorative beauty care for a fresh, polished finish.', points:['Skincare services','Grooming and finishing touches'] },
  { slug:'nail-art', title:'Nail Art & Care', img:'nails', blurb:'Detailed nail artistry from understated to statement.', points:['Nail art','Nail care'] },
  { slug:'makeup', title:'Makeup', img:'makeup', blurb:'Makeup tailored to your look and your occasion.', points:['Occasion makeup','Everyday looks'] },
]

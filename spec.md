# MediCare Clinic Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full single-page clinic/doctor website with multi-section layout
- Navigation bar with links to all sections
- Homepage hero section with doctor photo, tagline, and Book Appointment CTA
- About Doctor section: name, qualifications, experience, specialization, biography
- Services section: list of medical services with icons (General Checkup, Consultation, Emergency Care, Pediatrics, Cardiology, Lab Tests)
- Appointment Booking form: Name, Phone, Email, Date, Message fields with submit
- Patient Reviews / Testimonials section: sample patient feedback cards
- Contact section: clinic address, phone, email, embedded map placeholder
- Footer with social media links (Facebook, Twitter, Instagram, LinkedIn)
- Mobile-responsive design throughout

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Generate doctor portrait and clinic hero images
2. Generate Motoko backend with appointment booking data model (store appointments, submit form)
3. Build React frontend:
   - Navbar with smooth scroll navigation
   - Hero section with doctor image and CTA
   - About section with doctor profile details
   - Services grid with icons
   - Appointment booking form (connected to backend)
   - Testimonials carousel/grid
   - Contact section with map embed placeholder
   - Footer with social links
4. Apply medical color theme: white, blue (#1e40af / #3b82f6), light green (#86efac / #22c55e)
5. Ensure full mobile responsiveness

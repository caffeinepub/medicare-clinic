import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Award,
  Baby,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Cross,
  Facebook,
  FlaskConical,
  Heart,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  Stethoscope,
  ThumbsUp,
  Twitter,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Testimonial } from "./backend.d";
import { useAddAppointment, useGetAllTestimonials } from "./hooks/useQueries";

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Appointments", href: "#appointments" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const services = [
  {
    icon: Stethoscope,
    title: "General Checkup",
    description: "Comprehensive health evaluations to keep you at your best",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ClipboardList,
    title: "Consultation",
    description: "Expert medical advice and personalized treatment plans",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Zap,
    title: "Emergency Care",
    description: "Immediate attention for urgent medical situations",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Baby,
    title: "Pediatric Care",
    description: "Gentle, specialized care for infants and children",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Heart,
    title: "Cardiology",
    description: "Heart health monitoring, diagnostics and preventive care",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: FlaskConical,
    title: "Lab Tests",
    description: "Full-service diagnostic testing and results analysis",
    color: "bg-purple-50 text-purple-600",
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    patientName: "Sarah Johnson",
    review:
      "Dr. Mitchell is an exceptional physician. He took the time to listen to all my concerns and provided a clear, comprehensive treatment plan. I've never felt more confident in my healthcare.",
    rating: 5,
    date: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    patientName: "Michael Torres",
    review:
      "Outstanding care from start to finish. The clinic is clean, the staff is friendly, and Dr. Mitchell truly cares about his patients. Highly recommend to anyone looking for a trustworthy doctor.",
    rating: 5,
    date: BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    patientName: "Emily Chen",
    review:
      "After years of searching for a doctor who truly listens, I found Dr. Mitchell. His attention to detail and compassionate approach make every visit a positive experience.",
    rating: 5,
    date: BigInt(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
  {
    patientName: "Robert Williams",
    review:
      "I brought my entire family to Dr. Mitchell. His expertise in both adult and pediatric care is impressive. We feel so well cared for at MediCare Clinic.",
    rating: 4,
    date: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

// ─── Helper Components ───────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

function SectionHeader({
  badge,
  title,
  subtitle,
  center = true,
}: {
  badge: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <Badge className="mb-4 bg-medical-blue/10 text-medical-blue border-0 hover:bg-medical-blue/15 font-semibold px-4 py-1 text-sm">
        {badge}
      </Badge>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNavClick("#home")}
          data-ocid="nav.link"
          className="flex items-center gap-2 font-display font-bold text-xl text-medical-blue"
        >
          <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
            <Cross className="h-4 w-4 text-white" />
          </div>
          MediCare Clinic
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-medical-blue bg-medical-blue/8"
                    : "text-foreground/70 hover:text-medical-blue hover:bg-medical-blue/5"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            data-ocid="nav.book_appointment.button"
            onClick={() => handleNavClick("#appointments")}
            className="bg-medical-blue hover:bg-medical-blue-dark text-white shadow-sm"
            size="sm"
          >
            Book Appointment
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          data-ocid="nav.menu.toggle"
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="container px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:text-medical-blue hover:bg-medical-blue/5 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                data-ocid="nav.mobile.book_appointment.button"
                onClick={() => handleNavClick("#appointments")}
                className="mt-2 bg-medical-blue hover:bg-medical-blue-dark text-white"
              >
                Book Appointment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function HeroSection() {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-gradient pt-16"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-medical-blue/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-medical-green/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-medical-blue/3 blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <Badge className="mb-6 bg-medical-green-light text-green-800 border-0 px-4 py-1.5 text-sm font-semibold">
              🏥 Trusted Healthcare Partner
            </Badge>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground mb-6">
              Caring for Your Health,{" "}
              <span className="text-medical-blue">Every Step</span> of the Way
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Expert medical care with compassion and precision. Book your
              appointment today and experience healthcare that puts you first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                data-ocid="hero.book_appointment.primary_button"
                onClick={() => handleScroll("appointments")}
                size="lg"
                className="bg-medical-blue hover:bg-medical-blue-dark text-white shadow-card px-8 group"
              >
                Book Appointment
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                data-ocid="hero.learn_more.secondary_button"
                onClick={() => handleScroll("about")}
                size="lg"
                variant="outline"
                className="border-medical-blue/30 text-medical-blue hover:bg-medical-blue/5"
              >
                Learn More
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Users, label: "5,000+ Patients" },
                { icon: Award, label: "15+ Years Experience" },
                { icon: ThumbsUp, label: "98% Satisfaction" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-medical-blue/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-medical-blue" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-medical-blue/20 to-medical-green/20 blur-xl" />

              {/* Image container */}
              <div className="relative w-72 h-80 md:w-80 md:h-96 lg:w-[340px] lg:h-[420px] rounded-3xl overflow-hidden shadow-hero border border-white/60">
                <img
                  src="/assets/generated/doctor-portrait.dim_600x700.jpg"
                  alt="Dr. James Mitchell"
                  className="w-full h-full object-cover object-top"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-medical-blue/20 to-transparent" />
              </div>

              {/* Floating card: Available */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card border border-border p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Accepting</p>
                  <p className="text-sm font-bold text-foreground">
                    New Patients
                  </p>
                </div>
              </motion.div>

              {/* Floating card: Rating */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card border border-border p-3"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-foreground">5.0 Rating</p>
                <p className="text-xs text-muted-foreground">200+ Reviews</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────────────────────────────

function AboutSection() {
  const stats = [
    { value: "5,000+", label: "Patients Treated" },
    { value: "15+", label: "Years Experience" },
    { value: "98%", label: "Patient Satisfaction" },
  ];

  const qualifications = ["MBBS", "MD (Internal Medicine)", "FRCP"];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-medical-blue/10 to-medical-green/10" />
            <div className="relative rounded-2xl overflow-hidden shadow-card aspect-[4/5]">
              <img
                src="/assets/generated/doctor-portrait.dim_600x700.jpg"
                alt="Dr. James Mitchell"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Stats floating cards */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl shadow-card border border-border p-4">
              <div className="grid grid-cols-3 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-xl font-bold text-medical-blue">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SectionHeader
              badge="About the Doctor"
              title="Meet Dr. James Mitchell"
              center={false}
            />

            <p className="text-muted-foreground leading-relaxed mb-8 text-base">
              Dr. James Mitchell is a board-certified physician with over 15
              years of experience providing compassionate, patient-centered
              care. He completed his medical training at Johns Hopkins
              University and has since dedicated his career to improving the
              health and well-being of his community. His approach combines
              evidence-based medicine with a personal touch, ensuring every
              patient feels heard and cared for.
            </p>

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  label: "Specialization",
                  value: "Internal Medicine & General Practice",
                },
                { label: "Experience", value: "15+ Years" },
                { label: "Hospital", value: "MediCare Clinic, New York" },
                { label: "Languages", value: "English, Spanish" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-muted/60 rounded-xl p-4 border border-border"
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Qualifications */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">
                Qualifications
              </p>
              <div className="flex flex-wrap gap-2">
                {qualifications.map((q) => (
                  <Badge
                    key={q}
                    className="bg-medical-blue/10 text-medical-blue border-0 hover:bg-medical-blue/15 px-3 py-1"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    {q}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              className="mt-8 bg-medical-blue hover:bg-medical-blue-dark text-white"
              onClick={() =>
                document
                  .getElementById("appointments")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="about.book_appointment.button"
            >
              Book a Consultation
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-muted/40">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            badge="Our Services"
            title="Comprehensive Medical Care"
            subtitle="From routine checkups to specialized treatments, we provide a wide range of services to meet your healthcare needs."
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <Card
                  data-ocid={`services.item.${index + 1}`}
                  className="bg-white border border-border shadow-none hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-default h-full"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-5`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center text-medical-blue text-sm font-semibold">
                      Learn more
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Appointment Section ─────────────────────────────────────────────────────

function AppointmentSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const mutation = useAddAppointment();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await mutation.mutateAsync({
        patientName: form.name,
        phone: form.phone,
        email: form.email,
        preferredDate: BigInt(new Date(form.date).getTime()),
        message: form.message,
      });
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", date: "", message: "" });
      toast.success("Appointment booked successfully!");
    } catch {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <section id="appointments" className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              badge="Appointments"
              title="Book an Appointment"
              subtitle="Schedule your visit with Dr. Mitchell today. We'll confirm your appointment within 24 hours."
              center={false}
            />

            <div className="space-y-5">
              {[
                {
                  icon: Phone,
                  title: "Call Us",
                  value: "+1 (555) 123-4567",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "contact@medicareclinic.com",
                  color: "bg-green-50 text-green-600",
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  value: "Mon–Fri: 8AM–6PM | Sat: 9AM–2PM",
                  color: "bg-purple-50 text-purple-600",
                },
              ].map(({ icon: Icon, title, value, color }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/60 border border-border"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {title}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border border-border shadow-card">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      data-ocid="appointment.success_state"
                      className="text-center py-10"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        Appointment Booked!
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        Thank you! We'll confirm your appointment within 24
                        hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSuccess(false)}
                        className="border-medical-blue/30 text-medical-blue hover:bg-medical-blue/5"
                      >
                        Book Another
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold"
                          >
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            data-ocid="appointment.name.input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="border-border focus:border-medical-blue"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-semibold"
                          >
                            Phone Number{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            data-ocid="appointment.phone.input"
                            placeholder="+1 (555) 000-0000"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="border-border focus:border-medical-blue"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="email"
                            className="text-sm font-semibold"
                          >
                            Email Address{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            data-ocid="appointment.email.input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="border-border focus:border-medical-blue"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="date"
                            className="text-sm font-semibold"
                          >
                            Preferred Date{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            data-ocid="appointment.date.input"
                            value={form.date}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="border-border focus:border-medical-blue"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="message"
                          className="text-sm font-semibold"
                        >
                          Message / Notes
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          data-ocid="appointment.message.textarea"
                          placeholder="Please describe your symptoms or reason for visit..."
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          className="border-border focus:border-medical-blue resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        data-ocid="appointment.submit_button"
                        disabled={mutation.isPending}
                        className="w-full bg-medical-blue hover:bg-medical-blue-dark text-white"
                        size="lg"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            Book Appointment
                            <CalendarDays className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ────────────────────────────────────────────────────

function TestimonialsSection() {
  const { data: testimonials, isLoading } = useGetAllTestimonials();

  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : fallbackTestimonials;

  return (
    <section id="testimonials" className="py-20 bg-muted/40">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            badge="Testimonials"
            title="What Our Patients Say"
            subtitle="Real stories from real patients who have experienced the MediCare difference."
          />
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="testimonials.loading_state"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-border animate-pulse"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-4 h-4 rounded bg-muted" />
                  ))}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
                <div className="h-4 bg-muted rounded w-2/5" />
              </div>
            ))}
          </div>
        ) : (
          <div
            data-ocid="testimonials.list"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayTestimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={`${testimonial.patientName}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card
                  data-ocid={`testimonials.item.${index + 1}`}
                  className="bg-white border border-border shadow-none hover:shadow-card transition-all duration-300 h-full"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <StarRating rating={testimonial.rating} />
                    <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-5 flex-1">
                      "{testimonial.review}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-9 h-9 rounded-full bg-medical-blue/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-medical-blue font-bold text-sm">
                          {testimonial.patientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {testimonial.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            Number(testimonial.date),
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Contact Section ─────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            badge="Contact Us"
            title="Find Us & Get in Touch"
            subtitle="We're here to help. Reach out to us through any of the channels below."
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card
              data-ocid="contact.card"
              className="border border-border shadow-card h-full"
            >
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    MediCare Clinic
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your trusted healthcare partner
                  </p>
                </div>

                {[
                  {
                    icon: MapPin,
                    label: "Address",
                    value:
                      "123 Healthcare Boulevard, Medical District, New York, NY 10001",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+1 (555) 123-4567",
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "contact@medicareclinic.com",
                    color: "bg-purple-50 text-purple-600",
                  },
                  {
                    icon: Clock,
                    label: "Hours",
                    value: "Mon–Fri: 8AM–6PM | Sat: 9AM–2PM | Sun: Closed",
                    color: "bg-orange-50 text-orange-600",
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-border">
                  <Button
                    data-ocid="contact.book_appointment.button"
                    onClick={() =>
                      document
                        .getElementById("appointments")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full bg-medical-blue hover:bg-medical-blue-dark text-white"
                  >
                    Book an Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Map */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              data-ocid="contact.map_marker"
              className="rounded-2xl overflow-hidden border border-border shadow-card h-full min-h-[400px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1614607126268!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MediCare Clinic Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: "#",
      ocid: "footer.facebook.link",
    },
    { icon: Twitter, label: "Twitter", href: "#", ocid: "footer.twitter.link" },
    {
      icon: Instagram,
      label: "Instagram",
      href: "#",
      ocid: "footer.instagram.link",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "#",
      ocid: "footer.linkedin.link",
    },
  ];

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-white">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Cross className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">
                MediCare Clinic
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              Providing compassionate, expert medical care to the community.
              Your health is our priority, and your well-being is our mission.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href, ocid }) => (
                <a
                  key={label}
                  href={href}
                  data-ocid={ocid}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-medical-blue flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-semibold text-sm mb-4 uppercase tracking-wider text-white/80">
              Quick Links
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={`footer.${link.label.toLowerCase()}.link`}
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-sm mb-4 uppercase tracking-wider text-white/80">
              Contact
            </p>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "123 Healthcare Blvd, NY 10001" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: Mail, text: "contact@medicareclinic.com" },
                { icon: Clock, text: "Mon–Fri: 8AM–6PM" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-medical-green" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} MediCare Clinic. All rights reserved.</p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <AppointmentSection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

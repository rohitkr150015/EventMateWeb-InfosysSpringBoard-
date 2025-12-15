import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ================= HERO IMAGES ================= */
const heroImages = [
    "/heropics/img1.jpg",
    "/heropics/img2.jpg",
    "/heropics/img3.jpg",
    "/heropics/img4.jpg",
    "/heropics/img5.jpg",
    "/heropics/img6.jpg",
    "/heropics/img7.jpg",
];

/* ================= PRELOAD IMAGES ================= */
const preloadImages = (images) => {
    images.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
};

/* ================= FRAMER VARIANTS ================= */
const slideVariants = {
    enter: { x: "100%" },
    center: { x: 0 },
    exit: { x: "-100%" },
};

/* ================= HERO CAROUSEL ================= */
function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        preloadImages(heroImages);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* SLIDER */}
            <AnimatePresence>
                <motion.div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImages[index]})` }}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                />
            </AnimatePresence>

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-slate-900/65" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen grid md:grid-cols-2 gap-12 items-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="uppercase tracking-widest text-sm text-emerald-300">
                        AI Based Event Planner
                    </p>

                    <h1 className="text-4xl md:text-5xl font-extrabold mt-3 leading-tight">
                        Plan Events <br />
                        Smarter With AI
                    </h1>

                    <p className="mt-5 text-slate-200 max-w-lg">
                        Discover, book, manage events and unlock AI-generated greeting cards
                        with secure payments and real-time communication.
                    </p>

                    <div className="mt-8 flex gap-4">

                        <Link
                            to="/login"
                            className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 font-semibold"
                        >
                            Sign Up
                        </Link>
                    </div>
                </motion.div>

                {/* VIDEO */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="rounded-2xl overflow-hidden shadow-2xl"
                >
                    <video
                        className="w-full h-64 md:h-80 object-cover"
                        src="https://res.cloudinary.com/dmdgurwmv/video/upload/f_auto,q_auto/lv_0_20251216011522_u81n4t"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                    />
                </motion.div>


                {/*<motion.div*/}
                {/*    initial={{ opacity: 0, scale: 0.95 }}*/}
                {/*    animate={{ opacity: 1, scale: 1 }}*/}
                {/*    transition={{ duration: 0.8 }}*/}
                {/*    className="rounded-2xl overflow-hidden shadow-2xl"*/}
                {/*>*/}
                {/*    <iframe*/}
                {/*        className="w-full h-64 md:h-80"*/}
                {/*        src="https://www.youtube.com/embed/dQw4w9WgXcQ"*/}
                {/*        title="Event Preview"*/}
                {/*        allowFullScreen*/}
                {/*    />*/}
                {/*</motion.div>*/}
                {/* VIDEO */}



            </div>
        </section>
    );
}

/* ================= FEATURES ================= */
function Features() {
    const features = [
        ["🎟️", "Smart Booking", "Book events quickly with real-time availability."],
        ["🤖", "AI Chatbot", "Instant answers to queries and support."],
        ["🎁", "AI Greeting Cards", "Unlocked after full payment."],
        ["🛠️", "Admin Dashboard", "Manage events, users, payments easily."],
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-4">Why AI Event Planner?</h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-16">
                    One platform that solves booking, communication, and management
                    problems intelligently.
                </p>

                <div className="grid md:grid-cols-4 gap-10">
                    {features.map(([icon, title, desc]) => (
                        <motion.div
                            key={title}
                            whileHover={{ y: -8 }}
                            className="p-6 rounded-xl border shadow-sm hover:shadow-lg transition"
                        >
                            <div className="text-4xl mb-4">{icon}</div>
                            <h3 className="font-semibold text-lg">{title}</h3>
                            <p className="text-sm text-slate-600 mt-2">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ================= FOOTER ================= */
function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
                <div>
                    <h3 className="text-white font-bold text-lg mb-3">
                        AI Event Planner
                    </h3>
                    <p className="text-sm">
                        AI-powered platform for smart event booking and management.
                    </p>
                </div>

                {/*<div>*/}
                {/*    <h4 className="text-white font-semibold mb-3">Quick Links</h4>*/}
                {/*    <ul className="space-y-2 text-sm">*/}
                {/*        <li>Home</li>*/}
                {/*        <li>Events</li>*/}
                {/*        <li>Membership</li>*/}
                {/*        <li>Contact</li>*/}
                {/*    </ul>*/}
                {/*</div>*/}

                <div>
                    <h4 className="text-white font-semibold mb-3">Contact</h4>
                    <p className="text-sm">support@aieventplanner.com</p>
                    <p className="text-sm mt-1">India</p>
                </div>
            </div>

            <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm">
                © 2025 AI Event Planner. All rights reserved.
            </div>
        </footer>
    );
}

/* ================= MAIN PAGE ================= */
export default function Homepage() {
    return (
        <div className="w-full bg-[#f6f3e6]">
            <HeroCarousel />
            <Features />
            <Footer />
        </div>
    );
}

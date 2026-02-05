"use client";
import React from "react";
import { useApp } from "@/app/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/sections/Hero/Hero";
import ProductSection from "@/sections/Products/ProductSection";
import AboutSection from "@/sections/About/AboutSection";
import ReviewSection from "@/sections/Reviews/ReviewSection";
import MapSection from "@/sections/Map/MapSection";
import CartModal from "@/components/feedback/CartModal";

export default function HomePage() {
    const { activeTheme, products, activeIndex, setActiveIndex } = useApp();

    return (
        <div
            style={
                {
                    "--color-primary": activeTheme.primary,
                    "--color-secondary": activeTheme.secondary,
                    "--glow-color": activeTheme.glow,
                    background: activeTheme.bg,
                } as React.CSSProperties
            }
        >
            <Navbar />
            <main>
                <Hero
                    products={products}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                />
                <ProductSection />
                <AboutSection />
                <ReviewSection />
                <MapSection />
            </main>
            <Footer />
            <CartModal />
        </div>
    );
}

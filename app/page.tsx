import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhatYouGet } from "@/components/landing/what-you-get";
import { ProductGrid } from "@/components/landing/product-grid";
import { Proof } from "@/components/landing/proof";
import { Faq } from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhatYouGet />
      <ProductGrid />
      <Proof />
      <Faq />
    </>
  );
}

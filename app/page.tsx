import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import IntelligenceEngine from "@/components/landing/IntelligenceEngine";
import Footer from "@/components/shared/Footer";
import ChatBot from "@/components/chatbot/ChatBot";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const content = (
    <>
      <Hero />
      <BentoGrid />
      <IntelligenceEngine />
      <Footer />
    </>
  );

  if (userId) {
    return (
      <DashboardShell className="" bgClassName="bg-slate-50 dark:bg-[#0F1115]">
        {content}
        <ChatBot />
      </DashboardShell>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0F1115]">
      {content}
      <ChatBot />
    </main>
  );
}

import { Headset, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SupportContent = () => {
  return (
    <div className="max-w-2xl mx-auto pt-6 pb-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gray-100 rounded-full p-2">
          <Headset size={32} className="vi-text-primary" />
        </div>
        <h1 className="vi-text-primary text-3xl font-bold">Support Center</h1>
      </div>
      <p className="vi-text text-gray-700 mb-10 text-base">
        Welcome to the Support Center. We&#39;re here to help you with any questions, issues, or feedback you may have about our platform.
      </p>
      <div className="space-y-8">
        <div className="flex items-start gap-4 bg-muted rounded-lg p-5 border">
          <div className="bg-gray-100 rounded-full p-1 mt-1">
            <HelpCircle size={24} className="vi-text-primary" />
          </div>
          <div>
            <h2 className="vi-text-primary font-semibold text-lg mb-1">Frequently Asked Questions</h2>
            <p className="vi-text text-muted-foreground mb-2">
              Check our{" "}
              <a href="/faq" className="text-blue-600 underline hover:text-blue-800 transition">
                FAQ page
              </a>{" "}
              for answers to common questions.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-1">
              <a href="/faq">Go to FAQ</a>
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-muted rounded-lg p-5 border">
          <div className="bg-gray-100 rounded-full p-1 mt-1">
            <Mail size={24} className="vi-text-primary" />
          </div>
          <div>
            <h2 className="vi-text-primary font-semibold text-lg mb-1">Contact Us</h2>
            <p className="vi-text text-muted-foreground mb-2">
              If you need further assistance, please email us at{" "}
              <a href="mailto:vochidung.dev@gmail.com" className="text-blue-600 underline hover:text-blue-800 transition">
                vochidung.dev@gmail.com
              </a>.
            </p>
            <Button asChild variant="default" size="sm" className="mt-1">
              <a href="mailto:vochidung.dev@gmail.com">Email Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportContent
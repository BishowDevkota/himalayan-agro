import ContactForm from "../components/ContactForm";

export const metadata = {
  title: "Contact — Himalayan",
  description: "Get in touch with us for support, orders or general questions.",
};

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto py-20 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold mb-4">Contact us</h1>
          <p className="text-gray-600 mb-6">Have a question about an order, product or partnership? Send us a message and we'll get back within 1–2 business days.</p>

          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <div className="font-medium">Email</div>
              <div className="text-gray-600">support@himalayan.example</div>
            </div>

            <div>
              <div className="font-medium">Phone</div>
              <div className="text-gray-600">+1 (555) 123-4567</div>
            </div>

            <div>
              <div className="font-medium">Address</div>
              <div className="text-gray-600">Kathmandu, Nepal</div>
            </div>

            <div className="pt-4 text-xs text-gray-500">You can also set a webhook by adding <code>CONTACT_WEBHOOK</code> to <code>.env.local</code> to forward messages to an external service.</div>
          </div>
        </div>

        <div className="w-full">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}

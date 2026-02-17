import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-charcoal text-parchment">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold mb-4">
              The Artificial Intelligencer
            </h3>
            <p className="text-warm-gray text-sm leading-relaxed max-w-md">
              A platform showcasing AI-assisted creative works under various persona identities. 
              Demonstrating the power of human-AI collaborative methodology.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Sections
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-warm-gray hover:text-parchment transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?category=us-news" className="text-warm-gray hover:text-parchment transition-colors">
                  US News
                </Link>
              </li>
              <li>
                <Link href="/?category=world" className="text-warm-gray hover:text-parchment transition-colors">
                  World
                </Link>
              </li>
              <li>
                <Link href="/?category=technology" className="text-warm-gray hover:text-parchment transition-colors">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/?category=commentary" className="text-warm-gray hover:text-parchment transition-colors">
                  Commentary
                </Link>
              </li>
              <li>
                <span className="text-warm-gray">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-warm-gray">
                  Contact
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-warm-gray">
          <p>© {currentYear} The Artificial Intelligencer. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Powered by AI, curated by humans.
          </p>
        </div>
      </div>
    </footer>
  );
}

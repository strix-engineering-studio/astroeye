import { Button } from "./button"
import { thoughtstream } from "@/lib/utils"

export function ThoughtStreamDemo() {
  return (
    <div className="max-w-content mx-auto px-6 py-10">
      {/* Typography Section */}
      <section className="mb-12">
        <h1 className="text-display font-heading font-bold text-text-primary mb-4">
          ThoughtStream Design System
        </h1>
        <p className="text-body text-text-primary leading-relaxed mb-6">
          A minimal, zen, distraction-free design system built for contemplative digital experiences.
        </p>
        
        <h2 className="text-headline font-heading font-bold text-text-primary mb-4">
          Typography Scale
        </h2>
        
        <div className="space-y-4">
          <h3 className="text-subhead font-heading text-text-primary">
            Subheading Example
          </h3>
          <p className="text-body-large text-text-primary">
            Body Large - Used for featured paragraphs and ledes
          </p>
          <p className="text-body text-text-primary">
            Body Default - The standard reading text with optimal line height
          </p>
          <p className="text-body-small text-text-secondary">
            Body Small - For sidebar text and footnotes
          </p>
          <p className="text-caption text-text-tertiary">
            Caption - Image captions and dates
          </p>
          <p className="text-overline text-text-secondary">
            Overline - Category labels
          </p>
        </div>
      </section>

      {/* Colors Section */}
      <section className="mb-12">
        <h2 className="text-headline font-heading font-bold text-text-primary mb-6">
          Color Palette
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary rounded-none"></div>
            <p className="text-caption text-text-secondary">Primary (Stone)</p>
            <p className="text-xs text-text-tertiary">#78716C</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-20 w-full bg-secondary rounded-none"></div>
            <p className="text-caption text-text-secondary">Secondary (Sage)</p>
            <p className="text-xs text-text-tertiary">#A8A29E</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-20 w-full bg-background border border-border-subtle rounded-none"></div>
            <p className="text-caption text-text-secondary">Background</p>
            <p className="text-xs text-text-tertiary">#FAFAF9</p>
          </div>
          
          <div className="space-y-2">
            <div className="h-20 w-full bg-surface border border-border-subtle rounded-none"></div>
            <p className="text-caption text-text-secondary">Surface</p>
            <p className="text-xs text-text-tertiary">#F5F5F4</p>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-headline font-heading font-bold text-text-primary mb-6">
          Buttons
        </h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-headline font-heading font-bold text-text-primary mb-6">
          Cards
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border-subtle bg-background p-9 hover:border-border-medium transition-colors">
            <h3 className="text-subhead font-heading mb-3">Default Card</h3>
            <p className="text-body text-text-secondary">
              A simple card with subtle border and clean typography.
            </p>
          </div>
          
          <div className="border border-border-medium bg-surface p-9">
            <h3 className="text-subhead font-heading mb-3">Elevated Card</h3>
            <p className="text-body text-text-secondary">
              Slightly elevated surface for important content.
            </p>
          </div>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="mb-12">
        <h2 className="text-headline font-heading font-bold text-text-primary mb-6">
          Inputs
        </h2>
        
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Name
            </label>
            <input 
              type="text"
              className="h-12 w-full bg-background border border-border-medium px-4 py-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input 
              type="email"
              className="h-12 w-full bg-background border border-border-medium px-4 py-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className="mb-12">
        <h2 className="text-headline font-heading font-bold text-text-primary mb-6">
          Spacing System
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary" style={{ marginLeft: thoughtstream.spacing.sm }}></div>
            <p className="text-body-small text-text-secondary">12px (1 unit)</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary" style={{ marginLeft: thoughtstream.spacing.md }}></div>
            <p className="text-body-small text-text-secondary">24px (2 units)</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="h-4 w-4 bg-primary"></div>
            <div className="h-4 w-4 bg-primary" style={{ marginLeft: thoughtstream.spacing.lg }}></div>
            <p className="text-body-small text-text-secondary">48px (4 units)</p>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="border-t border-border-subtle pt-8">
        <h2 className="text-headline font-heading font-bold text-text-primary mb-6">
          Design Principles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-subhead font-heading mb-4">Do&apos;s</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-success mt-1">✓</span>
                <span className="text-body text-text-primary">
                  Let white space dominate - generous margins and padding
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-success mt-1">✓</span>
                <span className="text-body text-text-primary">
                  Use Libre Baskerville for headings, Inter for body text
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-success mt-1">✓</span>
                <span className="text-body text-text-primary">
                  Maintain 680px max content width for optimal reading
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-subhead font-heading mb-4">Don&apos;ts</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-error mt-1">✗</span>
                <span className="text-body text-text-primary">
                  Add decorative elements that compete with text
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-error mt-1">✗</span>
                <span className="text-body text-text-primary">
                  Use more than two font weights per screen
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-error mt-1">✗</span>
                <span className="text-body text-text-primary">
                  Introduce rounded corners (except for avatars)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ThoughtStreamDemo
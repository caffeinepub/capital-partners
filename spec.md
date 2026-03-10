# Capital Partners

## Current State
The site has a `ServicesSection` with 8 service cards (5 active, 3 Coming Soon) and a separate `PackagesSection` with 3 blurred pricing tiers (Basic, Professional, Pro) with locked prices. The nav has both 'Services' and 'Packages' links.

## Requested Changes (Diff)

### Add
- Three detailed monthly service plan cards (Creator Launch $150/mo, Brand Growth $300/mo, Business Accelerator $600/mo) each with: price, best-for tagline, overview text, bullet list of included services with descriptions, and support level badge
- Custom Services section listing 7 one-time project services with price ranges
- Request Our Services CTA section with a service request form (Name, Email, Phone/WhatsApp, Discord Username, Business Name, Selected Service Plan, Project Details), 24h response note, and Discord community link

### Modify
- Replace old ServicesSection (8 generic cards) with new pricing plans section
- Replace PackagesSection with the Custom Services section
- Update nav to have one 'Services' link and one 'Request' link

### Remove
- Old service cards (Management, Promotions, Freelancing, etc.)
- Old Packages section with blurred pricing

## Implementation Plan
1. Replace SERVICES data and ServicesSection component with new PricingPlansSection showing 3 plan cards
2. Replace PACKAGES data and PackagesSection with CustomServicesSection
3. Add ServiceRequestSection with form (wired to existing backend contact submission)
4. Update nav links accordingly
5. Validate and build

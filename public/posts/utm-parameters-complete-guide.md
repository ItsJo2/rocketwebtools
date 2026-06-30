## What Are UTM Parameters?

UTM parameters are tags you add to the end of a URL that tell Google Analytics (or any analytics platform) where a visitor came from. UTM stands for Urchin Tracking Module — named after Urchin Software, the company Google acquired in 2005 that became Google Analytics.

When someone clicks a link with UTM parameters, your analytics platform captures those values and attributes the visit to the correct source, medium, and campaign.

## The Five UTM Parameters

There are five standard UTM parameters. Three are required for proper tracking, two are optional.

**utm_source** identifies the referrer — the website, newsletter, or platform sending the traffic. Examples: google, newsletter, facebook, twitter, linkedin.

**utm_medium** identifies the marketing channel. Examples: cpc (paid search), email, social, banner, affiliate, organic.

**utm_campaign** identifies the specific campaign or promotion. Examples: summer_sale, product_launch, brand_awareness.

**utm_term** is optional and used for paid search campaigns to identify which keyword triggered the ad.

**utm_content** is optional and used to differentiate between multiple links in the same campaign — for example, two different banner designs or two links in the same email.

## How to Build UTM URLs Correctly

A UTM URL looks like this:
https://yoursite.com/landing?utm_source=newsletter&utm_medium=email&utm_campaign=june_promo
The base URL comes first, followed by a question mark, then each parameter separated by ampersands.

Common mistakes to avoid: using spaces in parameter values (use underscores or hyphens instead), inconsistent capitalization (pick lowercase and stick with it), and missing required parameters.

## Best Practices for UTM Tracking

Create a consistent naming convention before you start and document it. If one person uses `utm_source=Google` and another uses `utm_source=google`, your analytics will show them as two different sources.

Use lowercase for all parameter values. UTM parameters are case-sensitive.

Never use UTM parameters on internal links. Adding UTM tags to links within your own site will break your session data and attribution.

Build every tracked URL using a UTM builder tool rather than typing them by hand to avoid typos.

## Building UTM URLs for Free

The UTM Campaign Link Builder on Rocket Web Tools generates clean tracking URLs instantly. Enter your destination URL, fill in the parameters, and copy the result. Quick-tag buttons let you add common sources and mediums in one click.

# Redesign How It Works Section

The goal is to transform the "How It Works" section into a "storeyed" page with a zig-zag layout, using pictures to make it interactive and engaging while maintaining an enterprise look.

## User Review Required
> [!NOTE]
> I will use high-quality Unsplash placeholder images for the steps. You can replace these with your own assets later.

## Proposed Changes

### Frontend Components (`resources/js/components/homepage`)

#### [MODIFY] [HowItWorks.tsx](file:///wsl.localhost/Ubuntu-24.04/home/lumasia/hencan/KBS/resources/js/components/homepage/HowItWorks.tsx)
-   **Structure**: Change from a grid of 4 cards to a vertical list of 4 rows.
-   **Layout**: Alternating "Text Left / Image Right" and "Image Left / Text Right" (Zig-Zag).
-   **Visuals**: Add relevant Unsplash images for each step (Registration, Order, Payment, Verification).
-   **Interactivity**: Add scroll-triggered fade-in animations for each row.
-   **Style**: Keep the enterprise typography and colors (Blue/Slate) but make it more narrative.

## Verification Plan

### Manual Verification
1.  **Visual Inspection**: Ensure the layout alternates correctly (Right/Left) and images load.
2.  **Responsiveness**: Verify that on mobile, the layout stacks vertically (Image on top or bottom consistent with design).
3.  **Build Check**: Run `npm run build` to ensure no syntax errors.

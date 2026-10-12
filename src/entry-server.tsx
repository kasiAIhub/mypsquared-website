// Build-time only: renders a route to static HTML so search engines see real content.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppRoutes } from "./App";
import { blogPosts } from "@/lib/blogPosts";

export { blogPosts };
export { SEO_OVERRIDES } from "@/lib/seoMeta";

export function render(url: string) {
  const queryClient = new QueryClient();
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

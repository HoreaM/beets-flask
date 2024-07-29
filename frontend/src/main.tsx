import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { createRouter, RouterProvider } from "@tanstack/react-router";

import { customizeFetch, queryClient } from "@/components/common/_query";
import { PrefetchConfigQueryClientProvider } from "@/components/common/useConfig";
import { StatusContextProvider } from "@/components/common/useSocket";
import Box from "@mui/material/Box";

import { routeTree } from "./routeTree.gen";
import ThemeProvider from "./theme";
import LoadingIndicator from "@/components/common/loadingIndicator";

// we tweak the backend-route on the dev server
customizeFetch();

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient,
    },
    defaultPreload: "intent",
    defaultPendingComponent: () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                margin: "auto",
                justifyContent: "center",
                alignItems: "center",

            }}
        >
            <LoadingIndicator />
        </Box>
    ),

    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    return (
        <PrefetchConfigQueryClientProvider client={queryClient}>
            <StatusContextProvider client={queryClient}>
                <ThemeProvider>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </StatusContextProvider>
        </PrefetchConfigQueryClientProvider>
    );
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}

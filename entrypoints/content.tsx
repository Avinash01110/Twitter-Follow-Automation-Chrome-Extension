import ReactDOM from "react-dom/client";
import ZenUI from "@/components/zen-ui";

// Helper to monitor tweet loading dynamically with MutationObserver
const observeTweets = () => {
  const observer = new MutationObserver(() => {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    console.log(`New tweets found: ${tweets.length}`);
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

export default defineContentScript({
  matches: ["*://*.x.com/home"],
  cssInjectionMode: "ui",
  runAt: "document_end",
  async main(ctx) {
    console.log("Hello content.");

    // Observe tweets as they are dynamically added
    observeTweets();

    const ui = await createShadowRootUi(ctx, {
      name: "zen-ui",
      position: "inline",
      anchor: "body",
      onMount(container) {
        // Define how your UI will be mounted inside the container
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<ZenUI />);
        return root;
      },
      onRemove(root) {
        // Clean up any resources when the UI is removed
        root?.unmount();
      },
    });

    ui?.mount();
  },
});

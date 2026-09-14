import { useEffect, useMemo, useState } from "react";
import { subscribeCampaigns } from "../services/campaignService";
import { subscribeContent } from "../services/contentService";
import { subscribeProducts } from "../services/productService";
import type { Campaign, ContentItem, Product } from "../types";

export function usePlannerData() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loaded = 0;
    const markLoaded = () => {
      loaded += 1;
      if (loaded >= 3) setLoading(false);
    };

    const unsubContent = subscribeContent((items) => {
      setContent(items);
      markLoaded();
    });
    const unsubProducts = subscribeProducts((items) => {
      setProducts(items);
      markLoaded();
    });
    const unsubCampaigns = subscribeCampaigns((items) => {
      setCampaigns(items);
      markLoaded();
    });

    return () => {
      unsubContent();
      unsubProducts();
      unsubCampaigns();
    };
  }, []);

  return useMemo(
    () => ({ content, products, campaigns, loading }),
    [content, products, campaigns, loading],
  );
}

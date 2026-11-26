import type { NextConfig } from "next";

/**
 * 撮影サービスLP (design-rocket-certificates) は別のVercelプロジェクトだが、
 * SEO/AIO上のエンティティを go-bond.jp に統合するため、
 * サブドメインではなく /photo 配下として配信する。
 *
 * LP側は vite.config.ts の base を '/photo/' にしてあるので、
 * ブラウザは /photo/assets/... を要求する。ここで接頭辞を外して転送する。
 */
const PHOTO_LP_ORIGIN = "https://design-rocket-certificates-eosin.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/photo", destination: `${PHOTO_LP_ORIGIN}/` },
      { source: "/photo/:path*", destination: `${PHOTO_LP_ORIGIN}/:path*` },
    ];
  },
};

export default nextConfig;

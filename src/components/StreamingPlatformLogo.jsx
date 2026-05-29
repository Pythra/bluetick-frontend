function StreamingPlatformLogo({ slug, color, src, alt = '' }) {
  if (src) {
    return (
      <img
        className="streaming-platform-logo streaming-platform-logo--local"
        src={src}
        alt={alt}
        width={28}
        height={28}
        loading="lazy"
        decoding="async"
      />
    );
  }

  const cdnSrc = color
    ? `https://cdn.simpleicons.org/${slug}/${color}`
    : `https://cdn.simpleicons.org/${slug}`;

  return (
    <img
      className="streaming-platform-logo"
      src={cdnSrc}
      alt={alt}
      width={28}
      height={28}
      loading="lazy"
      decoding="async"
    />
  );
}

export default StreamingPlatformLogo;

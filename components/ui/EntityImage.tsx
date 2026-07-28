'use client';

import {useState} from 'react';

import type {EntityImage} from '@/types/api';

type EntityImageProps = {
  image?: EntityImage | null;
  altFallback: string;
  frameClassName: string;
  className?: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
  showAttribution?: boolean;
};

type LoadableImageProps = {
  image: EntityImage;
  imageUrl: string;
  altFallback: string;
  imageClassName?: string;
  loading: 'eager' | 'lazy';
  onError: () => void;
};

type EntityImageContentProps = EntityImageProps & {
  image: EntityImage;
  imageUrl: string;
};

export const getSafeHttpUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

export const getOrderedEntityImages = (
  images: readonly EntityImage[] | null | undefined,
): EntityImage[] =>
  (images ?? [])
    .map((image, index) => ({image, index}))
    .filter(({image}) => getSafeHttpUrl(image.url) !== null)
    .sort((left, right) => {
      const leftOrder = Number.isFinite(left.image.sortOrder) ? left.image.sortOrder : Number.MAX_SAFE_INTEGER;
      const rightOrder = Number.isFinite(right.image.sortOrder) ? right.image.sortOrder : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder || left.index - right.index;
    })
    .map(({image}) => image);

export const getPrimaryEntityImage = (
  ...imageGroups: Array<readonly EntityImage[] | null | undefined>
): EntityImage | null => {
  for (const images of imageGroups) {
    const [primaryImage] = getOrderedEntityImages(images);
    if (primaryImage) {
      return primaryImage;
    }
  }
  return null;
};

function ImagePlaceholder() {
  return (
    <div
      aria-hidden='true'
      className='absolute inset-0 grid place-items-center overflow-hidden bg-brand text-accent'
    >
      <div className='absolute -right-10 -top-12 size-40 rounded-full border border-accent/35' />
      <div className='absolute -bottom-16 -left-8 size-44 rounded-full bg-accent/10' />
      <svg viewBox='0 0 96 72' className='relative h-14 w-20' fill='none'>
        <path d='M8 57c16-19 28-28 40-28 11 0 22 8 40 28' stroke='currentColor' strokeWidth='3' />
        <path d='M19 57c12-11 21-16 29-16 9 0 18 5 29 16' stroke='currentColor' strokeWidth='3' />
        <circle cx='69' cy='17' r='8' fill='currentColor' />
      </svg>
    </div>
  );
}

function LoadableImage({
  image,
  imageUrl,
  altFallback,
  imageClassName,
  loading,
  onError,
}: Readonly<LoadableImageProps>) {
  const width = typeof image.width === 'number' && image.width > 0 ? image.width : 1600;
  const height = typeof image.height === 'number' && image.height > 0 ? image.height : 900;
  const altText =
    typeof image.altText === 'string' && image.altText.trim() ? image.altText.trim() : altFallback;

  return (
    // The API permits arbitrary external image hosts, so direct browser loading is safer than a wildcard image proxy.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={altText}
      width={width}
      height={height}
      loading={loading}
      decoding='async'
      referrerPolicy='no-referrer'
      onError={onError}
      className={[
        'absolute inset-0 size-full object-cover',
        imageClassName ?? 'transition duration-300 group-hover:scale-[1.02]',
      ].join(' ')}
    />
  );
}

function ImageAttribution({image}: Readonly<{image: EntityImage}>) {
  const author = typeof image.author === 'string' ? image.author.trim() : '';
  const licenseName = typeof image.licenseName === 'string' ? image.licenseName.trim() : '';
  const licenseUrl = getSafeHttpUrl(image.licenseUrl);
  const sourcePageUrl = getSafeHttpUrl(image.sourcePageUrl);

  if (!author && !licenseName && !sourcePageUrl) {
    return null;
  }

  return (
    <figcaption className='mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-5 text-muted'>
      {author ? <span>Ảnh: {author}</span> : null}
      {licenseName && licenseUrl ? (
        <a
          href={licenseUrl}
          target='_blank'
          rel='noreferrer noopener'
          className='rounded-sm underline decoration-line underline-offset-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-focus'
        >
          {licenseName}
        </a>
      ) : licenseName ? (
        <span>{licenseName}</span>
      ) : null}
      {sourcePageUrl ? (
        <a
          href={sourcePageUrl}
          target='_blank'
          rel='noreferrer noopener'
          className='rounded-sm underline decoration-line underline-offset-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-focus'
        >
          Nguồn ảnh
        </a>
      ) : null}
    </figcaption>
  );
}

function EntityImageContent({
  image,
  imageUrl,
  altFallback,
  frameClassName,
  className,
  imageClassName,
  loading = 'lazy',
  showAttribution = false,
}: Readonly<EntityImageContentProps>) {
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <figure className={className}>
      <div className={['relative overflow-hidden bg-brand', frameClassName].join(' ')}>
        {hasFailed ? (
          <ImagePlaceholder />
        ) : (
          <LoadableImage
            image={image}
            imageUrl={imageUrl}
            altFallback={altFallback}
            imageClassName={imageClassName}
            loading={loading}
            onError={() => setHasFailed(true)}
          />
        )}
      </div>
      {showAttribution && !hasFailed ? <ImageAttribution image={image} /> : null}
    </figure>
  );
}

export function EntityImage({
  image,
  altFallback,
  frameClassName,
  className,
  imageClassName,
  loading = 'lazy',
  showAttribution = false,
}: Readonly<EntityImageProps>) {
  const imageUrl = getSafeHttpUrl(image?.url);

  return image && imageUrl ? (
    <EntityImageContent
      key={imageUrl}
      image={image}
      imageUrl={imageUrl}
      altFallback={altFallback}
      frameClassName={frameClassName}
      className={className}
      imageClassName={imageClassName}
      loading={loading}
      showAttribution={showAttribution}
    />
  ) : (
    <figure className={className}>
      <div className={['relative overflow-hidden bg-brand', frameClassName].join(' ')}>
        <ImagePlaceholder />
      </div>
    </figure>
  );
}

import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {
  EntityImage,
  getOrderedEntityImages,
  getPrimaryEntityImage,
  getSafeHttpUrl,
} from './EntityImage';

import type {EntityImage as EntityImageContract} from '@/types/api';

const createImage = (overrides: Partial<EntityImageContract> = {}): EntityImageContract => ({
  id: 'image-1',
  url: 'https://images.example.com/place.jpg',
  sourcePageUrl: 'https://source.example.com/place',
  altText: 'Vịnh biển xanh nhìn từ trên cao',
  author: 'Tác giả ảnh',
  licenseName: 'CC BY 4.0',
  licenseUrl: 'https://license.example.com/cc-by',
  width: 1600,
  height: 900,
  sortOrder: 0,
  ...overrides,
});

afterEach(cleanup);

describe('entity image helpers', () => {
  it('accepts only absolute HTTP and HTTPS URLs', () => {
    expect(getSafeHttpUrl('https://images.example.com/photo.jpg')).toBe(
      'https://images.example.com/photo.jpg',
    );
    expect(getSafeHttpUrl('http://images.example.com/photo.jpg')).toBe(
      'http://images.example.com/photo.jpg',
    );
    expect(getSafeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(getSafeHttpUrl('/relative/photo.jpg')).toBeNull();
    expect(getSafeHttpUrl('')).toBeNull();
  });

  it('orders usable images by sortOrder and preserves API order for ties', () => {
    const later = createImage({id: 'later', sortOrder: 5});
    const firstTie = createImage({id: 'first-tie', sortOrder: 1});
    const invalid = createImage({id: 'invalid', url: 'data:image/png;base64,abc', sortOrder: 0});
    const secondTie = createImage({id: 'second-tie', sortOrder: 1});

    expect(getOrderedEntityImages([later, firstTie, invalid, secondTie]).map(({id}) => id)).toEqual([
      'first-tie',
      'second-tie',
      'later',
    ]);
  });

  it('uses the first image group with a usable primary image', () => {
    const invalidPlaceImage = createImage({url: 'not-a-url'});
    const provinceImage = createImage({id: 'province-image'});

    expect(getPrimaryEntityImage([invalidPlaceImage], [provinceImage])).toBe(provinceImage);
    expect(getPrimaryEntityImage([], undefined)).toBeNull();
  });
});

describe('EntityImage', () => {
  it('uses API alt text and renders safe attribution links', () => {
    render(
      <EntityImage
        image={createImage()}
        altFallback='Ảnh điểm đến'
        frameClassName='aspect-video'
        showAttribution
      />,
    );

    expect(screen.getByAltText('Vịnh biển xanh nhìn từ trên cao')).toBeInTheDocument();
    expect(screen.getByText('Ảnh: Tác giả ảnh')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'CC BY 4.0'})).toHaveAttribute(
      'rel',
      'noreferrer noopener',
    );
    expect(screen.getByRole('link', {name: 'Nguồn ảnh'})).toHaveAttribute(
      'href',
      'https://source.example.com/place',
    );
  });

  it('uses fallback alt text and rejects unsafe attribution URLs', () => {
    render(
      <EntityImage
        image={createImage({
          altText: '   ',
          author: null,
          licenseUrl: 'javascript:alert(1)',
          sourcePageUrl: 'data:text/html,unsafe',
        })}
        altFallback='Ảnh về Hội An'
        frameClassName='aspect-video'
        showAttribution
      />,
    );

    expect(screen.getByAltText('Ảnh về Hội An')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('CC BY 4.0')).toBeInTheDocument();
  });

  it('shows the placeholder for missing, invalid, and failed images', () => {
    const {container, rerender} = render(
      <EntityImage
        image={null}
        altFallback='Ảnh điểm đến'
        frameClassName='aspect-video'
      />,
    );

    expect(container.querySelector('img')).not.toBeInTheDocument();

    rerender(
      <EntityImage
        image={createImage({url: 'file:///photo.jpg'})}
        altFallback='Ảnh điểm đến'
        frameClassName='aspect-video'
      />,
    );
    expect(container.querySelector('img')).not.toBeInTheDocument();

    rerender(
      <EntityImage
        image={createImage()}
        altFallback='Ảnh điểm đến'
        frameClassName='aspect-video'
      />,
    );
    const image = screen.getByAltText('Vịnh biển xanh nhìn từ trên cao');
    fireEvent.error(image);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('resets the visible image when the URL changes after a load failure', () => {
    const firstImage = createImage();
    const secondImage = createImage({
      id: 'image-2',
      url: 'https://images.example.com/second.jpg',
      altText: 'Ảnh thứ hai',
    });
    const {rerender} = render(
      <EntityImage image={firstImage} altFallback='Ảnh điểm đến' frameClassName='aspect-video' />,
    );

    fireEvent.error(screen.getByAltText('Vịnh biển xanh nhìn từ trên cao'));
    rerender(
      <EntityImage image={secondImage} altFallback='Ảnh điểm đến' frameClassName='aspect-video' />,
    );

    expect(screen.getByAltText('Ảnh thứ hai')).toBeInTheDocument();

    rerender(
      <EntityImage image={firstImage} altFallback='Ảnh điểm đến' frameClassName='aspect-video' />,
    );
    expect(screen.getByAltText('Vịnh biển xanh nhìn từ trên cao')).toBeInTheDocument();
  });
});

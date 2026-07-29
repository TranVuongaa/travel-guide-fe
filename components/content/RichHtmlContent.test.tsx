import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';

import {RichHtmlContent, sanitizeRichHtml} from './RichHtmlContent';

afterEach(cleanup);

describe('RichHtmlContent', () => {
  it('renders the API article structure, figure, caption, and safe source link', () => {
    const html = sanitizeRichHtml(`
      <figure>
        <img
          src="https://images.example.com/hue.jpg"
          alt="Công trình bên trong Đại Nội Huế"
          loading="eager"
        >
        <figcaption>
          Đại Nội Huế. Nguồn:
          <a href="https://commons.wikimedia.org/wiki/File:Hue">Wikimedia Commons</a>.
        </figcaption>
      </figure>
      <p>Một kế hoạch đơn giản giúp chuyến tham quan thoải mái hơn.</p>
      <h2>Thời gian phù hợp</h2>
      <ul><li>Đi vào buổi sáng.</li></ul>
      <blockquote>Kiểm tra giờ mở cửa trước ngày tham quan.</blockquote>
    `);

    const {container} = render(<RichHtmlContent html={html} />);

    expect(container.querySelector('figure')).toBeInTheDocument();
    expect(screen.getByAltText('Công trình bên trong Đại Nội Huế')).toHaveAttribute('loading', 'lazy');
    expect(screen.getByText(/Đại Nội Huế\. Nguồn:/)).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 2, name: 'Thời gian phù hợp'})).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Kiểm tra giờ mở cửa trước ngày tham quan.').closest('blockquote')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Wikimedia Commons'})).toHaveAttribute(
      'href',
      'https://commons.wikimedia.org/wiki/File:Hue',
    );
    expect(screen.getByRole('link', {name: 'Wikimedia Commons'})).toHaveAttribute(
      'rel',
      'noreferrer noopener',
    );
  });

  it('removes executable content, unsafe URLs, and unapproved attributes', () => {
    const html = sanitizeRichHtml(`
      <script>alert('unsafe')</script>
      <p onclick="alert('unsafe')" style="display:none">Nội dung an toàn</p>
      <a href="javascript:alert('unsafe')">Liên kết không an toàn</a>
      <img src="data:image/svg+xml,unsafe" alt="Ảnh không an toàn">
      <iframe src="https://unsafe.example.com">Khung không an toàn</iframe>
    `);

    const {container} = render(<RichHtmlContent html={html} />);

    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('iframe')).not.toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.querySelector('[onclick]')).not.toBeInTheDocument();
    expect(container.querySelector('[style]')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Nội dung an toàn')).toBeVisible();
    expect(screen.getByText('Liên kết không an toàn')).toBeVisible();
    expect(screen.queryByText('Khung không an toàn')).not.toBeInTheDocument();
  });
});

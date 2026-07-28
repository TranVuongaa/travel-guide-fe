import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import {ConfirmButton} from './ConfirmButton';

describe('ConfirmButton', () => {
  it('requires explicit confirmation before running a destructive action', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmButton
        label='Xóa'
        title='Xóa dữ liệu?'
        description='Hành động cần xác nhận.'
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole('button', {name: 'Xóa'}));
    expect(screen.getByRole('dialog', {name: 'Xóa dữ liệu?'})).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', {name: 'Xác nhận'}));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});

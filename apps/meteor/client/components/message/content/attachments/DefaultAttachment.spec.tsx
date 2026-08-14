import { mockAppRoot } from '@rocket.chat/mock-providers';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DefaultAttachment from './DefaultAttachment';

// the collapse-toggle store is a global singleton (by design, see CollapsedMessagesProvider),
// so each test below uses its own message id to avoid leaking state between tests
const giphyAttachment = (mid: string) => ({
	mid,
	title: 'GIPHY',
	image_url: 'https://media.giphy.com/foo.gif',
	image_alt: 'a fun gif',
});

it('should render expanded by default and collapse on toggle click', async () => {
	render(<DefaultAttachment {...giphyAttachment('message-1')} />, { wrapper: mockAppRoot().build() });

	expect(screen.getByRole('img')).toBeInTheDocument();

	await userEvent.click(screen.getByTitle('Collapse'));

	expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('should keep a manually collapsed attachment collapsed after the row unmounts and remounts (simulating virtua recycling it on scroll)', async () => {
	const attachment = giphyAttachment('message-2');
	const { unmount } = render(<DefaultAttachment {...attachment} />, { wrapper: mockAppRoot().build() });

	await userEvent.click(screen.getByTitle('Collapse'));
	expect(screen.queryByRole('img')).not.toBeInTheDocument();

	unmount();

	render(<DefaultAttachment {...attachment} />, { wrapper: mockAppRoot().build() });

	expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('should keep a manually expanded attachment expanded after unmount/remount when collapsed by default', async () => {
	const attachment = { ...giphyAttachment('message-3'), collapsed: true };

	const { unmount } = render(<DefaultAttachment {...attachment} />, { wrapper: mockAppRoot().build() });

	expect(screen.queryByRole('img')).not.toBeInTheDocument();

	await userEvent.click(screen.getByTitle('Uncollapse'));
	expect(screen.getByRole('img')).toBeInTheDocument();

	unmount();

	render(<DefaultAttachment {...attachment} />, { wrapper: mockAppRoot().build() });

	expect(screen.getByRole('img')).toBeInTheDocument();
});

it('should not affect other messages when one is toggled', async () => {
	const { unmount } = render(<DefaultAttachment {...giphyAttachment('message-4a')} />, { wrapper: mockAppRoot().build() });
	await userEvent.click(screen.getByTitle('Collapse'));
	unmount();

	render(<DefaultAttachment {...giphyAttachment('message-4b')} />, { wrapper: mockAppRoot().build() });
	expect(screen.getByRole('img')).toBeInTheDocument();
});

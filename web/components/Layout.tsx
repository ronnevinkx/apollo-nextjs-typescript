import Head from 'next/head';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<Head>
				<title>My Blog</title>
			</Head>
			<div>{children}</div>
		</>
	);
};

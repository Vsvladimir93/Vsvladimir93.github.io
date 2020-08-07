import React from 'react';
import { render } from '@testing-library/react';

import './styles.scss';

import Header from './Header';
import Footer from './Footer';

const Container = () => {
	return (
		<div className='page-container'>
			<Header></Header>
			<div className='content'></div>
		</div>
	);
};

export default Container;

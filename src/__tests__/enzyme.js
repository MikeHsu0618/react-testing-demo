import React from 'react';
import { shallow } from 'enzyme';

it('renders welcome message', () => {
    const wrapper = shallow(<h2>Welcome to React</h2>);
    const welcome = <h2>Welcome to React</h2>;
    // expect(wrapper.contains(welcome)).toBe(true);
    expect(wrapper.contains(welcome)).toEqual(true);
});
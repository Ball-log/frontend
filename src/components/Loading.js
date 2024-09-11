import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

function Spinner() {
    return (
        <Wrapper>
            <Loading>
                <ActivityIndicator color='#C51E3A' />
            </Loading>
        </Wrapper>
    );
}

export default Spinner;

const Wrapper = styled.View``;

const Loading = styled.View`
    justify-content: center;
    align-items: center;
`;
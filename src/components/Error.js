import React from 'react'
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

export default function Error() {
    const navigation = useNavigation();

    const handlePress = () => {
      navigation.goBack();
    };

  return (
    <Wrapper>
        <Text0>Error! Please reload the App.</Text0>
        <Text3 onPress={handlePress}>
            <Text0>Go Back</Text0>
        </Text3>
    </Wrapper>
  )
}

const Wrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 20px;
`;

const Text0 = styled.Text`

`;

const Text3 = styled.TouchableOpacity`
border-width: 1px;
border-color: #000;
border-radius: 5px;
padding: 5px;
`;
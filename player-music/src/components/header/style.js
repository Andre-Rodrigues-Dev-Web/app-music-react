import styled from 'styled-components';

const Containerheader = styled.div`
    display:flex;
	justify-content: space-between;
	padding: 20px 15px 5px 15px;
    button{
	    cursor: pointer;
    }
    .icon{
        background: transparent;
        border: none;
        font-size: 20px;
        color: white;
    }

    .headerText{
        color: white;
        font-size: 20px;
    }
`;

export {
    Containerheader
}
import styled, { keyframes, css } from 'styled-components';

const vibrate = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid #eee;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;

    ${props =>
      props.hasError &&
      css`
        & {
          border: 1px solid red
          animation: ${vibrate} 0.82s cubic-bezier(0, 0.3, 0, 0.3) both;
        }
      `}
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
`;

/** As props referem-se as propriedades que sao passadas do componente para a estilizacao. Pode-se tambem
 * informar propriedades dos componentes, como neste caso o type* */
export const SubmitButton = styled.button.attrs(props => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  /**Se a propriedade disabled estiver como true, faz as instrucoes abaixo**/
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row; /**Direcao da disposicao dos dados**/
    justify-content: space-between; /**Adiciona um espacamento entre os componentes**/
    align-items: center; /**Utilizado para centralizar elementos da linha**/

    /**Aplicar estilizacao em todos menos no primeiro li*/
    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`;

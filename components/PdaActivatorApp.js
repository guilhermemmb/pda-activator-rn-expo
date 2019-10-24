import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Form,
  Item,
  Label,
  Input,
  Button,
  Text,
  Card,
  CardItem,
  Thumbnail,
  Icon,
  Spinner
} from "native-base";

import { Keyboard } from "react-native";

import { Col, Row, Grid } from "react-native-easy-grid";

import { getProducts, activeDiscount } from "../services/pdaService";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default () => {
  const [inputCpf, setInputCpf] = useState("");
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  const activeBtnHandler = async () => {
    Keyboard.dismiss();

    setLoading(true);
    
    const products = await getProducts(inputCpf);

    setProductList(products);
    activeProducts(products);
    
    setLoading(false);
  };

  const activeProducts = async products => {
    let tempArr = [...products];
    await asyncForEach(tempArr, async (product, idx) => {
      try {
        await activeDiscount(inputCpf, product.code);

        tempArr[idx].activated = true;
      } catch (err) {
        console.log(err);
      }
    });

    setProductList(tempArr);
  };

  const onChangeCpf = cpf => {
    setInputCpf(cpf);
  };

  return (
    <Container>
      <Header>
        <Left />
        <Body>
          <Title>PDA ACTIVATOR</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Form>
          <Grid>
            <Row>
              <Col size={6}>
                <Item fixedLabel>
                  <Label>CPF</Label>
                  <Input onChangeText={onChangeCpf} />
                </Item>
              </Col>
              <Col size={2}></Col>
              <Col size={4}>
                <Button
                  primary
                  onPress={activeBtnHandler}
                  onClick={activeBtnHandler}
                >
                  <Text>Ativar itens</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Form>
        {loading && !productList.length && <Spinner color="blue" />}
        {productList.map((product, idx) => (
          <Card key={idx}>
            <CardItem cardBody>
              <Left>
                <Thumbnail
                  source={{ uri: product.image }}
                  style={{ height: 100, width: 100 }}
                />
              </Left>
              <Body>
                <Col size={2}>
                  <Text>{product.name}</Text>
                </Col>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Text>expira em {product.days}</Text>
              </Left>
              <Body>
                <Text>{`${product.discount} % desc.`}</Text>
              </Body>

              <Right>
                {product.activated ? (
                  <Icon
                    name="check-circle"
                    color="#36b036"
                    type="MaterialIcons"
                  >
                    <Text>ativado</Text>
                  </Icon>
                ) : (
                  <Icon name="error" color="#36b036" type="MaterialIcons">
                    <Text>não ativado</Text>
                  </Icon>
                )}
              </Right>
            </CardItem>
          </Card>
        ))}
      </Content>
    </Container>
  );
};

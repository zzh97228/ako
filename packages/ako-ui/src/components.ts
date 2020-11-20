import { Component } from 'vue';

import { Card, CardActions, CardContent, CardTitle } from '@lagabu/card';
import { Row, Column, Container } from '@lagabu/grid';
import { Btn } from '@lagabu/btn';
import { Application } from '@lagabu/application';

export const components: Record<string, Component> = {
  Application,
  Card,
  CardActions,
  CardContent,
  CardTitle,
  Row,
  Col: Column,
  Container,
  Btn,
};

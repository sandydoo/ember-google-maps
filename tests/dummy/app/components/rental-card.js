import Component from '@glimmer/component';

export default class RentalCard extends Component {
  id = `rental-${this.args.rental.id}`;
}

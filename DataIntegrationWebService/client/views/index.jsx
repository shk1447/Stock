var React = require('react');

var Books = React.createClass({  
  propTypes: {
    books: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      books: (this.props.books || [])
    };
  },
  onBook: function(book) {
    this.state.books.push(book);

    this.setState({
      books: this.state.books
    });
  },
  render: function() {
    var books = this.state.books.map(function(book) {
      return <Book title={book.title} read={book.read}></Book>;
    });

    return (
      <div>
        <BookForm onBook={this.onBook}></BookForm>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Read</th>
            </tr>
          </thead>
          <tbody>{books}</tbody>
        </table>
      </div>
    );
  }
});
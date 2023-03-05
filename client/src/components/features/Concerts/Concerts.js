import Concert from './../Concert/Concert';

const Concerts = ({ concerts }, index) => (
  <section>
    {concerts.map(con => <Concert key={con.id} {...con} />)}
  </section>
)

export default Concerts;
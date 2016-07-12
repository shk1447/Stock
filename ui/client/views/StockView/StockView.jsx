var n = require('nuxjs');

module.exports = React.createClass({
    onSearch : function (e) {
        $(this.refs.search_container.children).animate({width: 'toggle'},200,function(){
        });
    },
    getInitialState : function () {
        return {searchType:"Code", searchText:"", start:"-2y",end:"-0d"};
    },
    componentDidMount : function () {
    },
    componentWillUnmount : function () {

    },
    componentDidUpdate : function () {

    },
    render : function () {
        var self = this;

        return (
            <div className="scheduler-container" ref="scheduler_container">
                <div style={{height:'5.3%', padding:'1em', float:'left', background:'white'}}>
                    <i className="fa fa-search fa-lg activeIcon" ref="search_schedule" onClick={this.onSearch} style={{color:'#099994'}}></i>
                </div>
                <div ref="search_container" style={{height:'5.3%', float:'left',padding:'0.65em 1em 0.65em 0em', background:'white'}}>
                    <n.TextField ref="start_text" width={60} placeholder={'Start'} style={{height:'100%'}} value={this.state.start} onChange={function(_comp,_val){
                        self.state.start = _val;
                    }}/>
                    <n.TextField ref="end_text" width={60} placeholder={'End'} style={{marginLeft: '5px', height:'100%'}} value={this.state.end} onChange={function(_comp,_val){
                        self.state.end = _val;
                    }}/>
                    <select name='search_type' placeholder={'Filter'} onChange={function(e){
                        self.setState({searchType : $(e.target).val()});
                    }} style={{width:'120px', height:'100%', marginLeft: '5px', border: '1px solid #b6b6b6'}}>
                        <option value="code">Code</option>
                        <option value="name">Name</option>
                        <option value="query">Query</option>
                    </select>
                    <n.TextField ref="search_text" width={600} placeholder={'Search'} style={{marginLeft: '5px', height:'100%'}} value={this.state.searchText}/>
                </div>
                <div style={{height:'95%', width:'100%', float:'left'}}>
                    <div id={"price-area"} style={{float:'left',width:'50%', height:'50%', border:'1px dashed #099994'}}>
                    </div>
                    <div id={"volume-area"} style={{float:'left',width:'50%', height:'50%', border:'1px dashed #099994'}}>
                    </div>
                    <div id={"short-trix-area"} style={{float:'left',width:'50%', height:'50%', border:'1px dashed #099994'}}>
                    </div>
                    <div id={"long-trix-area"} style={{float:'left',width:'50%', height:'50%', border:'1px dashed #099994'}}>
                    </div>
                </div>
            </div>
        )
    }
});
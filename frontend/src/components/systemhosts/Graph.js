import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2'
import moment from 'moment'

export class Graph extends Component {
    static propTypes = {
        selected_systemhost_id: PropTypes.number,
        systemhosts: PropTypes.array.isRequired
    }

    componentDidUpdate(prevProps) {
        const { selected_systemhost_id, systemhosts } = this.props;
        if ((systemhosts !== prevProps.systemhosts) || (selected_systemhost_id !== prevProps.selected_systemhost_id)) {
            const systemhost = systemhosts.find(systemhost => systemhost.id === selected_systemhost_id)
            if (systemhost) {
                this.update_graph_data(systemhost)
            };
            this.setState({
                selected_systemhost_id: selected_systemhost_id
            });
        };
    };

    componentDidMount() {
        const { selected_systemhost_id, systemhosts } = this.props;
        const systemhost = systemhosts.find(systemhost => systemhost.id === selected_systemhost_id)
        if (systemhost) {
            this.update_graph_data(systemhost)
        };
        this.setState({
            selected_systemhost_id: selected_systemhost_id
        });
    }

    state = {
        selected_systemhost_id: null,
        water_levels: []
    }

    update_graph_data(systemhost) {
            var water_levels = []

            const timeFormat = 'MM/DD/YYY HH:mm';
            var time = []
            const temp = systemhost.water_levels.split(";")
            temp.forEach((water_level, index) => {
                if ( water_level && water_level !== "" ) {
                    time.push(moment().add(temp.length - index, 'm').format(timeFormat))
                    water_levels.push({x: time[index], y: parseFloat(water_level)})
                }
            });
            
            this.setState({
                water_levels: water_levels
            });
    }

    render() {
        const timeFormat = 'MM/DD/YYY HH:mm';
        const { water_levels, selected_systemhost_id } = this.state;

        if ( !selected_systemhost_id ) {
            return null;
        }

        const data = {
            datasets: [{
                label: 'Water Level',
                backgroundColor: '#00aaff22',
                borderColor: '#00aaff',
                data: water_levels
            }]
        }
        const axes = [
            { primary: true, type: 'linear', position: 'bottom' },
            { type: 'linear', position: 'right' }
        ]
        const options = {
            title: {
                text: 'Water Level Graph'
            },
            animation: {
                x: {
                    duration: 5000,
                    from: 500
                },
                y: {
                    duration: 3000,
                    from: 500
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        parser: timeFormat,
                        tooltipFormat: 'll HH:mm'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Water Level'
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 4
                    }
                }]
            },
            maintainAspectRatio: false
        };

        return (
            <div className="card card-body mt-4 mb-4 text-center">
                <h2 className="card-title">System Host Graph</h2>
                <hr />
                <div
                    style={{
                        height: '300px'
                    }}
                >
                    <Line data={data} axes={axes} options={options}/>
                </div>
                <h4 className="mt-2">Water Level</h4>
            </div>
        );
    };
};

const mapStatToProps = state => ({
    systemhosts: state.systemhosts.systemhosts,
    selected_systemhost_id: state.systemhosts.selected_systemhost_id,
});

export default connect(mapStatToProps, {})(Graph);

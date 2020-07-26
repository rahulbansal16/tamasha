import PropTypes from 'prop-types'
import { Visibility, Image, Loader } from 'semantic-ui-react'
import React from 'react';


export default class LazyImage extends React.Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
        size: PropTypes.string,
    }

    static defaultProps = {
        size: `medium`,
    }

    state = {
        show: false,
    }

    showImage = () => {
        this.setState({
            show: true,
        })
    }

    render() {
        // const { size } = this.props
        // if (!this.state.show) {
        //     return (
        //         <Visibility as="span" onTopVisible={this.showImage}>
        //             <Loader active inline="centered" size={size} />
        //         </Visibility>
        //     )
        // }
        return <div style = {{minHeight: '70px'}}><Image {...this.props} /></div>
    }
}
import React from 'react'
import classes from './IssuesPage.scss'

// components
import IssueTable from 'components/IssueTable'
import IssueDetails from 'components/IssueDetails'
import _ from 'lodash'

import { Grid, Row, Col } from 'react-bootstrap'

export default class IssuesPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      affix: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    const offset = 139;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    this.setState({
      affix: scrollTop >= offset
    });
  }

  selectIssue = (issue) => {
    this.props.resetGetAddressResponse()
    this.props.selectIssue(issue)
  }

  render() {
    let content = <div className={classes.empty}>No issues found. Are you logged in?</div>
    if(this.props.getIssuesResponse) {
      const hasError = _.has(this.props.getIssuesResponse, 'error')
      if(hasError && this.props.getIssuesResponse.error === 'Unauthorized') {
        this.props.resetGetIssuesResponse()
      }
      content = (
        <Grid fluid={true} className={classes.container}>
          <Row className="show-grid" className={classes.row}>
            <Col md={7} className={classes.main}>
              <IssueTable issues={this.props.getIssuesResponse.data} selected={this.props.getSelectedIssue} onSelect={this.props.selectIssue}/>
            </Col>
            <Col md={5} className={classes.sidebar + ' ' + (this.state.affix ? classes.affixed : '')}>
              <IssueDetails issue={
                  _.find(
                    this.props.getIssuesResponse.data,
                    (issue) => (issue.id == this.props.getSelectedIssue)
                  )}
                  {...this.props} />
            </Col>
          </Row>
        </Grid>)
        content = (
          <div className={classes['flex-container']}>
            <div className={classes.issuesList}>
              <IssueTable issues={this.props.getIssuesResponse.data} selected={this.props.getSelectedIssue} onSelect={this.selectIssue}/>
            </div>
            <div className={classes.issueDetails}>
              <IssueDetails issue={
                _.find(
                  this.props.getIssuesResponse.data,
                  (issue) => (issue.id == this.props.getSelectedIssue)
                )}
                {...this.props} />
            </div>
          </div>
        )
    } else {
      this.props.getIssues()
    }
    return (
      <div className={classes.wrapper}>
        {content}
      </div>
    )
  }
}

IssuesPage.propTypes = {
  getIssuesResponse: React.PropTypes.object,
  getIssues: React.PropTypes.func.isRequired,
  resetGetIssuesResponse: React.PropTypes.func.isRequired,
  selectIssue: React.PropTypes.func.isRequired,
  getSelectedIssue: React.PropTypes.number.isRequired,
  resetGetAddressResponse: React.PropTypes.func.isRequired
}

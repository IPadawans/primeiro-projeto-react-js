import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from 'react-icons/io';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList, IssueFilter, PageActions } from './styles';

// import { Container } from './styles';
export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filters: [
      { state: 'all', label: 'Todos', active: true },
      { state: 'open', label: 'Abertos', active: false },
      { state: 'closed', label: 'Fechados', active: false },
    ],
    filterIdx: 0,
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { filters, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters.find(f => f.active).state,
          per_page: 5,
          page,
        },
      }),
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleFilterClick = async filterIndex => {
    await this.setState({ filterIdx: filterIndex });
    this.reloadIssues();
  };

  reloadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIdx, page } = this.state;
    const repoName = decodeURIComponent(match.params.repository);
    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filters[filterIdx].state,
        per_page: 5,
        page,
      },
    });
    this.setState({ issues: response.data });
  };

  handlePages = async action => {
    const { page } = this.state;
    await this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });
    this.reloadIssues();
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filters,
      filterIdx,
      page,
    } = this.state;
    if (loading) {
      return <Loading> Carregando </Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueList>
          <IssueFilter active={filterIdx}>
            {filters.map((filter, index) => (
              <button
                type="button"
                key={filter.label}
                onClick={() => this.handleFilterClick(index)}
              >
                {filter.label}
              </button>
            ))}
          </IssueFilter>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PageActions>
          <button
            type="button"
            disabled={page < 2}
            onClick={() => this.handlePages('back')}
          >
            <IoIosArrowRoundBack />
          </button>
          <span>Pagina: {page}</span>
          <button type="button" onClick={() => this.handlePages('next')}>
            <IoIosArrowRoundForward />
          </button>
        </PageActions>
      </Container>
    );
  }
}

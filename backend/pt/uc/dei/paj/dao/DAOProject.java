package pt.uc.dei.paj.dao;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import pt.uc.dei.paj.dto.DTOProject;
import pt.uc.dei.paj.entity.NewsPiece;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.Status;
import pt.uc.dei.paj.entity.User;

@Stateless
public class DAOProject extends AbstractDao<Project> {
	private static final long serialVersionUID = 1L;

	public DAOProject() {
		super(Project.class);
	}

	public Project convertDtoToEntity(DTOProject projectDto, User user) {

		Project project = new Project();

		project.setTitle(projectDto.getTitle());
		project.setDescription(projectDto.getDescription());
		project.setImage(projectDto.getImage());
		project.setOwnerProj(user);
		if(projectDto.getKeywordList() != null|| !projectDto.getKeywordList().isEmpty()) {
			project.setKeywordListProject(projectDto.getKeywordList().toLowerCase());
		} else {
			project.setKeywordListProject("");
		}
		return project;
	}

	// usado pelo editar projeto
	public Project convertDtoToEntity(DTOProject dtoProject, Project project) {

		project.setTitle(dtoProject.getTitle());
		project.setDescription(dtoProject.getDescription());
		project.setImage(dtoProject.getImage());
		project.setStatus(dtoProject.getStatus());
		if(dtoProject.getKeywordList() != null|| !dtoProject.getKeywordList().isEmpty()) {
			project.setKeywordListProject(dtoProject.getKeywordList().toLowerCase());
		} else {
			project.setKeywordListProject("");
		}
		
		//project.setKeywordListProject(dtoProject.getKeywordList().toLowerCase());

		return project;
	}

	public DTOProject convertEntityToDto(Project project) {

		DTOProject dto = new DTOProject();

		dto.setTitle(project.getTitle());
		dto.setDescription(project.getDescription());
		String date = String.valueOf(project.getLastUpdate());//(String) new SimpleDateFormat("dd-MM-yyyy HH:mm").format(project.getLastUpdate());
		dto.setLastUpdate(date);
		dto.setImage(project.getImage());
		dto.setStatus(project.getStatus());
		dto.setKeywordList(project.getKeywordListProject());
		dto.setId(project.getId());
		return dto;
	}

	public List<Project> listProjectAccordingToStatus(Status status) {

		try {
			/*
			 * /* final CriteriaQuery<User> criteriaQuery =
			 * em.getCriteriaBuilder().createQuery(User.class);
			 * 
			 * Root<User> c= criteriaQuery.from(User.class);
			 * 
			 * criteriaQuery.select(c).where(em.getCriteriaBuilder().and(
			 * em.getCriteriaBuilder().equal(c.get("deleted"),false),
			 * em.getCriteriaBuilder().equal(c.get("adminPrivileges"),true)));
			 * 
			 * return em.createQuery(criteriaQuery).getResultList();
			 */

			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);
			criteriaQuery.select(p)
					.where(em.getCriteriaBuilder().and(em.getCriteriaBuilder().equal(p.get("status"), Status.visible)));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public List<Project> listProjectsVisAndInvis() {

		try {

			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);
			criteriaQuery.select(p)
					.where(em.getCriteriaBuilder().or(em.getCriteriaBuilder().equal(p.get("status"), Status.visible),
							em.getCriteriaBuilder().equal(p.get("status"), Status.invisible)));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<Project> getMyProjects(String username) {
		try {
			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);

			criteriaQuery.select(p).where(em.getCriteriaBuilder()
					.and(em.getCriteriaBuilder().equal(p.get("ownerProj").get("username"), username)));

			return em.createQuery(criteriaQuery).getResultList();
		} catch (Exception e) {
			return null;
		}
	}

	public List<User> getProjectMembers(int projectId) {
		try {

			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);
			Root<User> u = criteriaQuery.from(User.class);
			Join<User, Project> p = u.join("projectColabList");

			criteriaQuery.select(u).where(em.getCriteriaBuilder().equal(p.get("id"), projectId));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<Project> getProjectsUserCoAuthors(String username) {

		try {

			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);
			Join<Project, User> u = p.join("projectMemberList");

			criteriaQuery.select(p).where(em.getCriteriaBuilder().equal(u.get("username"), username));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<Project> getProjectByKeyword(String keyword) {

		try {
			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);

			criteriaQuery.select(p).where(
					em.getCriteriaBuilder().or(
							em.getCriteriaBuilder().like(p.get("keywordListProject"),
									'%' + keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(p.get("keywordListProject"), keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(p.get("keywordListProject"), '%' + keyword.toLowerCase())),

					(em.getCriteriaBuilder()
							.and(em.getCriteriaBuilder().or(
									em.getCriteriaBuilder().equal(p.get("status"), Status.visible),
									em.getCriteriaBuilder().equal(p.get("status"), Status.invisible)))));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<Project> getProjectByKeywordOnlyVisible(String keyword) {

		try {
			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);

			criteriaQuery.select(p).where(
					em.getCriteriaBuilder().or(
							em.getCriteriaBuilder().like(p.get("keywordListProject"),
									'%' + keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(p.get("keywordListProject"), keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(p.get("keywordListProject"), '%' + keyword.toLowerCase())),

					(em.getCriteriaBuilder().and(em.getCriteriaBuilder()
							.or(em.getCriteriaBuilder().equal(p.get("status"), Status.visible)))));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<NewsPiece> getAssociatedNews(int projectId) {

		try {

			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);

			Join<NewsPiece, Project> p = n.join("projectList");

			criteriaQuery.select(n).where(em.getCriteriaBuilder().equal(p.get("id"), projectId));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			System.out.println("heyyyyy deu raia outra vez");
			return null;
		}
	}

	public Long totalNumberOfRegisteredProjects() {
		//https://stackoverflow.com/questions/2883887/in-jpa-2-using-a-criteriaquery-how-to-count-results

		try {
			
			CriteriaQuery<Long> cq = em.getCriteriaBuilder().createQuery(Long.class);
			cq.select(em.getCriteriaBuilder().count(cq.from(Project.class)));
			return em.createQuery(cq).getSingleResult();

		} catch (Exception e) {
			return null;
		}
	}

	public List<String> getAllKeywords() {
		try {

			final CriteriaQuery<String> criteriaQuery = em.getCriteriaBuilder().createQuery(String.class);
			Root<Project> p = criteriaQuery.from(Project.class);

			criteriaQuery.select(p.get("keywordListProject"));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public Project getMostRecentProjects() {
		try {

			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> rootProject = criteriaQuery.from(Project.class);

			// ver pelo last update, porque mesmo que só tenha criado o projeto, o last update assume a data de criação
			// criação da subquery para fazer a subconsulta da data
			Subquery<Date> subqueryUpdateDate = criteriaQuery.subquery(Date.class);
			Root<Project> rootSubqueryUpdateDate = subqueryUpdateDate.from(Project.class);

			// permite obter da maior data (mais recente) da lista
			subqueryUpdateDate
					.select(em.getCriteriaBuilder().greatest(rootSubqueryUpdateDate.<Date>get("lastUpdate")));

			// criação de um predicado da subconsulta, de forma a que se possa obter a notícia com aquela data obtida com a substring
			Predicate predicateUpdatedate = em.getCriteriaBuilder().equal(rootProject.get("lastUpdate"),
					subqueryUpdateDate);

			// atribuir o predicado à criteria query para poder obter o resultado
			criteriaQuery.where(predicateUpdatedate);

			return em.createQuery(criteriaQuery).getSingleResult();

		} catch (Exception e) {
			System.out.println("oi?");
			return null;
		}
	}

}

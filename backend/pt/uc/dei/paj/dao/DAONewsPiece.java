package pt.uc.dei.paj.dao;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import pt.uc.dei.paj.dto.DTONewsPiece;
import pt.uc.dei.paj.entity.NewsPiece;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.Status;
import pt.uc.dei.paj.entity.User;

@Stateless
public class DAONewsPiece extends AbstractDao<NewsPiece> {

	private static final long serialVersionUID = 1L;

	public DAONewsPiece() {
		super(NewsPiece.class);
	}

	public NewsPiece convertDtoToEntity(DTONewsPiece newsDto, User user) {

		NewsPiece newsPiece = new NewsPiece();
		newsPiece.setTitle(newsDto.getTitle());
		newsPiece.setDescription(newsDto.getDescription());
		newsPiece.setImage(newsDto.getImage());
		newsPiece.setOwnerNews(user);
		
		System.out.println(newsDto.getKeywordList());
		if(newsDto.getKeywordList() != null|| !newsDto.getKeywordList().isEmpty()) {
			newsPiece.setKeywordListNewsPiece(newsDto.getKeywordList().toLowerCase());
		} else {
			newsPiece.setKeywordListNewsPiece("");
		}
		//newsPiece.setKeywordListNewsPiece(newsDto.getKeywordList());
		
		return newsPiece;
	}

	// usado pelo editar projeto
	public NewsPiece convertDtoToEntity(DTONewsPiece dtonews, NewsPiece news) {

		news.setTitle(dtonews.getTitle());
		news.setDescription(dtonews.getDescription());
		news.setImage(dtonews.getImage());
		news.setStatus(dtonews.getStatus());
		if(dtonews.getKeywordList() != null|| !dtonews.getKeywordList().isEmpty()) {
			news.setKeywordListNewsPiece(dtonews.getKeywordList().toLowerCase());
		} else {
			news.setKeywordListNewsPiece("");
		}
		//news.setKeywordListNewsPiece(dtonews.getKeywordList().toLowerCase());

		return news;
	}

	public DTONewsPiece convertEntityToDto(NewsPiece news) {

		DTONewsPiece dto = new DTONewsPiece();

		dto.setTitle(news.getTitle());
		dto.setDescription(news.getDescription());
		//String date = (String) new SimpleDateFormat("dd-MM-yyyy HH:mm").format(news.getLastUpdate());
		String date = String.valueOf(news.getLastUpdate());
		dto.setLastUpdate(date);
		//dto.setLastUpdate(news.getLastUpdate());
		dto.setImage(news.getImage());
		dto.setStatus(news.getStatus());
		dto.setKeywordList(news.getKeywordListNewsPiece());
		dto.setId(news.getId());
		return dto;
	}

	public List<NewsPiece> listNewsAccordingToStatus(Status status) {

		try {
			
			System.out.println("eeeeeeeeeee" + status);
			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);
			criteriaQuery.select(n)
					.where(em.getCriteriaBuilder().and(em.getCriteriaBuilder().equal(n.get("status"), status)));

			return em.createQuery(criteriaQuery).getResultList();
		} catch (Exception e) {
			return new ArrayList<NewsPiece>();
		}
	}
	
	public List<NewsPiece> listNewsVisAndInvis(){
		
		try {
			
			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);
			criteriaQuery.select(n)
					.where(em.getCriteriaBuilder().or(
							em.getCriteriaBuilder().equal(n.get("status"), Status.visible), 
							em.getCriteriaBuilder().equal(n.get("status"), Status.invisible)));

			return em.createQuery(criteriaQuery).getResultList();
			
		} catch(Exception e) {
			return null;
		}
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
					.where(em.getCriteriaBuilder().and(em.getCriteriaBuilder().equal(p.get("status"), status)));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<User> getNewsMembers(int newsId) {
		try {

			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);
			Root<User> u = criteriaQuery.from(User.class);
			Join<User, NewsPiece> n = u.join("newsColabList");

			criteriaQuery.select(u).where(em.getCriteriaBuilder().equal(n.get("id"), newsId));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<NewsPiece> getNewsUserCoAuthors(String username) {

		try {

			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);
			Join<NewsPiece, User> u = n.join("newsCoAuthorsList");

			criteriaQuery.select(n).where(em.getCriteriaBuilder().equal(u.get("username"), username));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			System.out.println("oi?");
			return null;
		}
	}

	public List<NewsPiece> getMyNews(String username) {
		try {
			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);

			criteriaQuery.select(n).where(em.getCriteriaBuilder()
					.and(em.getCriteriaBuilder().equal(n.get("ownerNews").get("username"), username)));

			return em.createQuery(criteriaQuery).getResultList();
		} catch (Exception e) {
			System.out.println("oi?");
			return null;
		}
	}

	public List<User> getProjectMembers(int projectId) {
		try {

			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);
			Root<User> u = criteriaQuery.from(User.class);
			Join<User, NewsPiece> n = u.join("newsColabList");

			criteriaQuery.select(u).where(em.getCriteriaBuilder().equal(n.get("id"), projectId));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			System.out.println("oi?");
			return null;
		}
	}

	public List<NewsPiece> getNewsByKeyword(String keyword) {

		try {
			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);

			criteriaQuery.select(n).where(
					em.getCriteriaBuilder().or(
							em.getCriteriaBuilder().like(n.get("keywordListNewsPiece"),
									'%' + keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(n.get("keywordListNewsPiece"), keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(n.get("keywordListNewsPiece"), '%' + keyword.toLowerCase())),

					(em.getCriteriaBuilder()
							.and(em.getCriteriaBuilder().or(
									em.getCriteriaBuilder().equal(n.get("status"), Status.visible),
									em.getCriteriaBuilder().equal(n.get("status"), Status.invisible)))));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<NewsPiece> getNewsByKeywordOnlyVisible(String keyword) {

		try {
			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> n = criteriaQuery.from(NewsPiece.class);

			criteriaQuery.select(n).where(
					em.getCriteriaBuilder().or(
							em.getCriteriaBuilder().like(n.get("keywordListNewsPiece"),
									'%' + keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(n.get("keywordListNewsPiece"), keyword.toLowerCase() + '%'),
							em.getCriteriaBuilder().like(n.get("keywordListNewsPiece"), '%' + keyword.toLowerCase())),

					(em.getCriteriaBuilder().and(em.getCriteriaBuilder()
							.or(em.getCriteriaBuilder().equal(n.get("status"), Status.visible)))));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public List<Project> getAssociatedProjects(int newsId) {

		try {

			final CriteriaQuery<Project> criteriaQuery = em.getCriteriaBuilder().createQuery(Project.class);
			Root<Project> p = criteriaQuery.from(Project.class);

			Join<Project, NewsPiece> n = p.join("newsList");

			criteriaQuery.select(p).where(em.getCriteriaBuilder().equal(n.get("id"), newsId));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			System.out.println("heyyyyy deu raia");
			return null;
		}
	}

	// retirar este daqui
	/*
	 * public List<NewsPiece> getAssociatedNews(int projectId){
	 * 
	 * try {
	 * 
	 * final CriteriaQuery<NewsPiece> criteriaQuery =
	 * em.getCriteriaBuilder().createQuery(NewsPiece.class); Root<NewsPiece> n =
	 * criteriaQuery.from(NewsPiece.class);
	 * 
	 * Join<NewsPiece, Project> p = n.join("projectList");
	 * 
	 * criteriaQuery.select(n).where(em.getCriteriaBuilder().equal(p.get("id"),
	 * projectId));
	 * 
	 * return em.createQuery(criteriaQuery).getResultList();
	 * 
	 * } catch(Exception e) { System.out.println("heyyyyy deu raia outra vez");
	 * return null; } }
	 */

	public Long totalNumberOfRegisteredNews() {
		//https://stackoverflow.com/questions/2883887/in-jpa-2-using-a-criteriaquery-how-to-count-results
		try {

			CriteriaQuery<Long> cq = em.getCriteriaBuilder().createQuery(Long.class);
			cq.select(em.getCriteriaBuilder().count(cq.from(NewsPiece.class)));
			//cq.where(/*your stuff*/);
			return em.createQuery(cq).getSingleResult();
			
		} catch (Exception e) {
			return null;
		}
	}

	public List<String> getAllKeywords() {
		try {

			final CriteriaQuery<String> criteriaQuery = em.getCriteriaBuilder().createQuery(String.class);
			Root<NewsPiece> p = criteriaQuery.from(NewsPiece.class);

			criteriaQuery.select(p.get("keywordListNewsPiece"));

			return em.createQuery(criteriaQuery).getResultList();

		} catch (Exception e) {
			return null;
		}
	}

	public NewsPiece getMostRecentNews() {
		try {

			final CriteriaQuery<NewsPiece> criteriaQuery = em.getCriteriaBuilder().createQuery(NewsPiece.class);
			Root<NewsPiece> rootNews = criteriaQuery.from(NewsPiece.class);
			
			// ver pelo last update, porque mesmo que só tenha criado a notícia, o last update assume a data de criação
			// criação da subquery para fazer a subconsulta da data
			Subquery<Date> subqueryUpdateDate = criteriaQuery.subquery(Date.class);
			Root<NewsPiece> rootSubqueryUpdateDate = subqueryUpdateDate.from(NewsPiece.class);

			// permite obter da maior data (mais recente) da lista
			subqueryUpdateDate
					.select(em.getCriteriaBuilder().greatest(rootSubqueryUpdateDate.<Date>get("lastUpdate")));

			// criação de um predicado da subconsulta, de forma a que se possa obter a notícia com aquela data obtida com a substring
			Predicate predicateUpdatedate = em.getCriteriaBuilder().equal(rootNews.get("lastUpdate"),
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

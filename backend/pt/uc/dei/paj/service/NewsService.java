package pt.uc.dei.paj.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import pt.uc.dei.paj.dao.DAONewsPiece;
import pt.uc.dei.paj.dao.DAOProject;
import pt.uc.dei.paj.dao.DAOUser;
import pt.uc.dei.paj.dto.DTONewsPiece;
import pt.uc.dei.paj.dto.DTOProject;
import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.NewsPiece;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.Status;
import pt.uc.dei.paj.entity.User;

@RequestScoped
public class NewsService implements Serializable {

	private static final long serialVersionUID = 1L;

	// injects
	@Inject
	UserService userService;
	@Inject
	DAOUser userDao;
	@Inject
	DAONewsPiece newsDao;
	@Inject
	DAOProject projectDao;

	public NewsService() {

	}

	// método para criar uma nova notícia
	public void createNewsPiece(DTONewsPiece newsDto, User user) throws Exception {

		NewsPiece newsPiece = newsDao.convertDtoToEntity(newsDto, user);
		newsPiece.setStatus(Status.visible);

		if (!newsDto.getCoauthorList().isEmpty()) {
		
			List<User> arrayCoAuthorList = new ArrayList<>();

			for (String username : newsDto.getCoauthorList()) {
				User userCo = userService.findUserEntity(username);

				if (userCo != null) {

					if (userCo.isApproved()) {
						arrayCoAuthorList.add(userCo);
					}
				}
			}
			
			newsPiece.setNewsCoAuthorsList(arrayCoAuthorList);
		}
		newsDao.persist(newsPiece);
	}

	// método para encontrar a notícia através do seu id
	public DTONewsPiece findNewsPieceById(int id) {

		NewsPiece newsPiece = newsDao.find(id);
		DTONewsPiece dto = newsDao.convertEntityToDto(newsPiece);

		try {
			DTOUser ownerDto = userService.findUser(newsPiece.getOwnerNews().getUsername());
			dto.setOwner(ownerDto);
		} catch (Exception e) {
			return null;
		}

		List<User> newsUserList = newsDao.getNewsMembers(id);
		

		if (newsUserList.size() > 0) {
			List<String> usernameList = new ArrayList<>();
			for (User userAux : newsUserList) {
				if (userAux.isApproved()) {
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					usernameList.add(userAux.getUsername());
				}
			}
			dto.setCoauthorList(usernameList);
		}
		return dto;
	}

	public List<DTONewsPiece> findStatusNewsPiece(Status status) throws Exception {
		
		System.out.println("entrei no findStatusNewsPiece");

		List<NewsPiece> newsList = newsDao.listNewsAccordingToStatus(status);
		
		System.out.println("entrei no news dao e voltei");
		List<DTONewsPiece> dtoNewsList = new ArrayList<>();

		System.out.println(newsList.size() + "tamanhoooo");
		
		if(newsList.isEmpty()) {
			System.out.println("oiioooooooooooooo''''''''''''oooooi?");
		}
		System.out.println("oiii?");
		for (NewsPiece news : newsList) {
			DTONewsPiece dto = newsDao.convertEntityToDto(news);
			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				dto.setOwner(ownerDto);
			} catch (Exception e) {
				return null;
			}

			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			List<String> usernameList = new ArrayList<>();

			if (newsUserList.size() > 0) {
				for (User user : newsUserList) {
					if (user.isApproved()) {
						System.out.println("!!!!!!!!!!!" + user.getUsername());
						usernameList.add(user.getFirstName() + " " + user.getLastName());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			dtoNewsList.add(dto);

		}

		return dtoNewsList;

	}
	
	public List<DTONewsPiece> findNewsVisAndInvis() throws Exception {
		
		List<NewsPiece> newsList = newsDao.listNewsVisAndInvis();
		List<DTONewsPiece> dtoNewsList = new ArrayList<>();

		for (NewsPiece news : newsList) {
			DTONewsPiece dto = newsDao.convertEntityToDto(news);
			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				dto.setOwner(ownerDto);
			} catch (Exception e) {
				return null;
			}

			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			List<String> usernameList = new ArrayList<>();

			if (newsUserList.size() > 0) {
				for (User user : newsUserList) {
					if (user.isApproved()) {
						System.out.println("!!!!!!!!!!!" + user.getUsername());
						usernameList.add(user.getFirstName() + " " + user.getLastName());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			dtoNewsList.add(dto);

		}

		return dtoNewsList;
	}

	/*
	 * public List<DTOProject> findStatusProject(Status status) throws Exception{
	 * System.out.println("tipooo" + status);
	 * 
	 * List<Project> projectList = projectDao.listProjectAccordingToProject(status);
	 * List<DTOProject> dtoProjectList = new ArrayList<>();
	 * 
	 * System.out.println("espinafres"); for(Project project:projectList) {
	 * System.out.println("projeto"); DTOProject dto =
	 * projectDao.convertEntityToDto(project); System.out.println("projetoooo" +
	 * dto); try{ DTOUser ownerDto =
	 * userService.findUser(project.getOwnerProj().getUsername());
	 * System.out.println("ownerrrr" + ownerDto.getUsername());
	 * dto.setOwner(ownerDto); System.out.println("estamossss"); }catch(Exception e)
	 * { return null; }
	 * 
	 * List<User> projectUserList = projectDao.getProjectMembers(project.getId());
	 * System.out.println("oi tenho a lista mas não a posso ver" +
	 * projectUserList.get(0).getEmail()); List<String> usernameList = new
	 * ArrayList<>(); for(User user: projectUserList) { if(user.isApproved()) {
	 * System.out.println("!!!!!!!!!!!" + user.getUsername());
	 * usernameList.add(user.getUsername()); } }
	 * System.out.println("huhahahahahaha"); dto.setCoauthorList(usernameList);
	 * dtoProjectList.add(dto); } return dtoProjectList; }
	 */

	public List<DTONewsPiece> getNewsUserCoAuthors(User user) throws Exception {

		List<NewsPiece> newsListEntity = newsDao.getNewsUserCoAuthors(user.getUsername());
		List<DTONewsPiece> dtoNewslist = new ArrayList<>();

		for (NewsPiece news : newsListEntity) {
			System.out.println("noticia" + news.getTitle());
			DTONewsPiece dto = newsDao.convertEntityToDto(news);
			// System.out.println("projetoooo" + dto);
			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			List<String> usernameList = new ArrayList<>();

			for (User userAux : newsUserList) {
				if (userAux.isApproved()) {
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					usernameList.add(userAux.getFirstName() + " " + userAux.getLastName());
				}
			}
			System.out.println("huhahahahahaha");
			dto.setCoauthorList(usernameList);
			dtoNewslist.add(dto);
		}
		return dtoNewslist;
	}

	public List<DTONewsPiece> findMyNews(User user) throws Exception {

		List<NewsPiece> newsList = newsDao.getMyNews(user.getUsername());
		List<DTONewsPiece> myNewsList = new ArrayList<>();

		for (NewsPiece news : newsList) {
			System.out.println("noticia" + news.getTitle());
			DTONewsPiece dto = newsDao.convertEntityToDto(news);
			System.out.println("NOTICIAAAA" + dto);
			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (newsUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : newsUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getFirstName() + " " + userAux.getLastName());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			myNewsList.add(dto);
		}

		return myNewsList;

	}

	public void manageCoAuthors(int id, User user) throws Exception {
		NewsPiece news = newsDao.find(id);
		List<User> newsUserList = newsDao.getNewsMembers(id);
		int aux = -1;
		if (newsUserList.size() > 0) {
			for (int i = 0; i < newsUserList.size(); i++) {
				if (newsUserList.get(i).getUsername().equals(user.getUsername())) {
					aux = i;
				}
			}
		}

		if (aux == -1) {
			newsUserList.add(user);
		} else {
			newsUserList.remove(aux);
		}

		news.setNewsCoAuthorsList(newsUserList);

		newsDao.merge(news);

	}

	public void editNewsPiece(DTONewsPiece newsDto, int id) throws Exception {

		NewsPiece newsAux = newsDao.find(id);

		NewsPiece newsPiece = newsDao.convertDtoToEntity(newsDto, newsAux);

		if (!newsDto.getCoauthorList().isEmpty() || newsDto.getCoauthorList() != null) {
			List<User> arrayCoAuthorList = new ArrayList<>();

			System.out.println("uiiiii");
			for (String username : newsDto.getCoauthorList()) {

				System.out.println("wwwwwwwwwweeeeeeeeeeeewwwwwwwwwwwwww" + username);
				User userCo = userService.findUserEntity(username);
				System.out.println("oi?" + userCo.getFirstName() + " " + userCo.getLastName());
				if (userCo != null) {
					// project.getProjectMemberList().add(userCo);
					if (userCo.isApproved()) {
						arrayCoAuthorList.add(userCo);
					}
				}

			}
			newsPiece.setNewsCoAuthorsList(arrayCoAuthorList);
			System.out.println("caneco");
			newsDao.merge(newsPiece);
			System.out.println("canecoooooo");
		}
	}

	public void toggleStatus(int id, String statusAux) throws Exception {
		System.out.println(statusAux);
		NewsPiece news = newsDao.find(id);
		System.out.println(news.getTitle());

		if (statusAux.equals("visible")) {
			System.out.println("ssssssss");
			news.setStatus(Status.visible);

		} else if (statusAux.equals("invisible")) {
			System.out.println("!!!!!");
			news.setStatus(Status.invisible);

		} else if (statusAux.equals("deleted")) {
			System.out.println("WWWWWWWWW");
			news.setStatus(Status.deleted);

		}

		newsDao.merge(news);
	}

	public List<DTOUser> memberList(int id) throws Exception {

		List<User> memberList = newsDao.getProjectMembers(id);
		List<DTOUser> dtoList = new ArrayList<>();

		if (memberList.size() > 0) {
			for (User userAux : memberList) {
				if (userAux.isApproved()) {
					System.out.println("!!!!!!!!!!!" + userAux.getUsername());
					DTOUser dtoUser = userDao.convertEntityToDto(userAux);
					dtoList.add(dtoUser);
				}
			}
		}
		return dtoList;

	}

	public List<DTONewsPiece> newsWithKeywordsVisibleAndInvisible(String keyword) {

		List<NewsPiece> newsList = newsDao.getNewsByKeyword(keyword);
		List<DTONewsPiece> dtoNewslist = new ArrayList<>();

		for (NewsPiece news : newsList) {
			System.out.println("noticia" + news.getTitle());
			DTONewsPiece dto = newsDao.convertEntityToDto(news);
			System.out.println("NOTICIAAAA" + dto);
			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (newsUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : newsUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getFirstName() + " " + userAux.getLastName());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			dtoNewslist.add(dto);
		}

		return dtoNewslist;

	}

	public List<DTONewsPiece> newsWithKeywordsVisible(String keyword) {

		List<NewsPiece> newsList = newsDao.getNewsByKeywordOnlyVisible(keyword);
		List<DTONewsPiece> dtoNewslist = new ArrayList<>();

		for (NewsPiece news : newsList) {
			System.out.println("noticia" + news.getTitle());
			DTONewsPiece dto = newsDao.convertEntityToDto(news);
			System.out.println("NOTICIAAAA" + dto);
			try {
				DTOUser ownerDto = userService.findUser(news.getOwnerNews().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			/*
			 * List<String> authorList = new ArrayList<>();
			 * System.out.println("antes do for"); //System.out.println("lista" +
			 * project.getProjectMemberList()); for(User
			 * userAux:project.getProjectMemberList()) { System.out.println("@@@@" +
			 * userAux.getUsername()); authorList.add(userAux.getUsername()); }
			 * 
			 * System.out.println("hihi"); dto.setCoauthorList(authorList);
			 * System.out.println("uhuh");
			 * 
			 * dtoProjectList.add(dto);
			 */
			List<User> newsUserList = newsDao.getNewsMembers(news.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (newsUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : newsUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getFirstName() + " " + userAux.getLastName());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			dtoNewslist.add(dto);
		}

		return dtoNewslist;
	}

	public void associateNewsPieceAndProject(int idProject, int idNews) throws Exception {

		Project project = projectDao.find(idProject);
		NewsPiece news = newsDao.find(idNews);
		
		//verificar se nulo

		System.out.println(project.getTitle() + "!!!!!!!");
		System.out.println(news.getTitle() + "lol");

		List<Project> projectListAssociatedWithNewsPiece = newsDao.getAssociatedProjects(idNews);
		System.out.println(projectListAssociatedWithNewsPiece.size() + "tamanho lista dos projetos");
		List<NewsPiece> newsListAssociatedWithProject = projectDao.getAssociatedNews(idProject);

		System.out.println(news.getTitle() + "tamanho liista das notícias");

		boolean exist = false;
		for(Project proj:projectListAssociatedWithNewsPiece) {
			if(proj.getId() == idProject) {
				exist= true;
				break;
			}
		}
		//se existe numa lista também já existe no outro também
		if(!exist) {
		projectListAssociatedWithNewsPiece.add(project);
		

		System.out.println("adicionei o projeto à lista");
		newsListAssociatedWithProject.add(news);

		System.out.println("adicionei a notícia à lista");

		news.setProjectList(projectListAssociatedWithNewsPiece);

		System.out.println("set 1");
		project.setNewsList(newsListAssociatedWithProject);

		System.out.println("set 2");

		newsDao.merge(news);

		System.out.println("merge???");
		projectDao.merge(project);

		System.out.println("merge final??????");
		}

		// fazer query para ir buscar a lista de projetos que já estão associados com as
		// notícias e vice versa para adicionar esta entidade a essa lista, fazer set e
		// fazer merge
		// fazer tudo para ambas as entidades

	}

	public void desassociateNewsPieceAndProject(int idProject, int idNews) throws Exception {

		Project project = projectDao.find(idProject);
		NewsPiece news = newsDao.find(idNews);

		List<Project> projectListAssociatedWithNewsPiece = newsDao.getAssociatedProjects(idNews);
		System.out.println(projectListAssociatedWithNewsPiece.size() + "tamanho lista dos projetos");
		List<NewsPiece> newsListAssociatedWithProject = projectDao.getAssociatedNews(idProject);
		System.out.println(newsListAssociatedWithProject.size() + "tamanho liista das notícias");

		for (int i = 0; i < projectListAssociatedWithNewsPiece.size(); i++) {
			if (projectListAssociatedWithNewsPiece.get(i).getId() == idProject) {
				System.out.println("idddddd" + idProject);
				projectListAssociatedWithNewsPiece.remove(i);
			}
		}

		for (int i = 0; i < newsListAssociatedWithProject.size(); i++) {
			if (newsListAssociatedWithProject.get(i).getId() == idNews) {
				System.out.println("id" + idNews);
				newsListAssociatedWithProject.remove(i);
			}
		}
		
		news.setProjectList(projectListAssociatedWithNewsPiece);

		System.out.println("set 1" + projectListAssociatedWithNewsPiece.size());
		project.setNewsList(newsListAssociatedWithProject);

		System.out.println("set 2" + newsListAssociatedWithProject.size());

		newsDao.merge(news);

		System.out.println("merge???");
		projectDao.merge(project);

		System.out.println("merge final??????");

		
		

	}

	public List<DTOProject> getProjectsAssociatedWithNewsPiece(int id) {

		List<Project> projectAssociatedEntity = newsDao.getAssociatedProjects(id);
		List<DTOProject> dtoProjects = new ArrayList<>();

		for (Project proj : projectAssociatedEntity) {
			DTOProject dto = projectDao.convertEntityToDto(proj);

			try {
				DTOUser ownerDto = userService.findUser(proj.getOwnerProj().getUsername());
				System.out.println("ownerrrr" + ownerDto.getUsername());
				dto.setOwner(ownerDto);
				System.out.println("estamossss");
			} catch (Exception e) {
				return null;
			}
			List<User> newsUserList = newsDao.getNewsMembers(proj.getId());
			// System.out.println("oi tenho a lista mas não a posso ver" +
			// projectUserList.get(0).getEmail());
			if (newsUserList.size() > 0) {
				List<String> usernameList = new ArrayList<>();
				for (User userAux : newsUserList) {
					if (userAux.isApproved()) {
						System.out.println("!!!!!!!!!!!" + userAux.getUsername());
						usernameList.add(userAux.getFirstName() + " " + userAux.getLastName());
					}
				}
				System.out.println("huhahahahahaha");
				dto.setCoauthorList(usernameList);
			}
			dtoProjects.add(dto);
		}

		return dtoProjects;
	}

}

package pt.uc.dei.paj.dao;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;

@Stateless
public class DAOUser extends AbstractDao<User> {

	private static final long serialVersionUID = 1L;

	public DAOUser() {
		super(User.class);
	}

	// método para converter o dto na entidade - user
	public User convertDtoToEntity(DTOUser refDto) {

		User user = new User();
		user.setUsername(refDto.getUsername().toLowerCase());
		user.setPassword(refDto.getPassword());
		user.setEmail(refDto.getEmail());
		user.setFirstName(refDto.getFirstName());
		user.setLastName(refDto.getLastName());
		user.setBiography(refDto.getBiography());
		user.setProfilePic(refDto.getProfilePic());
		user.setType(refDto.getType());
		return user;
		// return null;
	}

	// método para converter o dto na entidade - user
	public User convertDtoToEntity(User user, DTOUser refDto) {

		user.setPassword(refDto.getPassword());
		user.setEmail(refDto.getEmail());
		user.setFirstName(refDto.getFirstName());
		user.setLastName(refDto.getLastName());
		user.setBiography(refDto.getBiography());
		user.setProfilePic(refDto.getProfilePic());
		return user;
		// return null;
	}

	// método para converter a entidade em dto - user
	public DTOUser convertEntityToDto(User user) {

		DTOUser userDto = new DTOUser();
		userDto.setUsername(user.getUsername());
		userDto.setPassword(user.getPassword());
		userDto.setEmail(user.getEmail());
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setProfilePic(user.getProfilePic());
		userDto.setType(user.getType());
		userDto.setBiography(user.getBiography());
		return userDto;
	}

	// querys
	// método para encontrar o user através do seu token
	public User findUserByToken(String token) {

		try {

			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);

			Root<User> u = criteriaQuery.from(User.class);

			criteriaQuery.select(u)
					.where(em.getCriteriaBuilder().and(em.getCriteriaBuilder().equal(u.get("token"), token)));

			return em.createQuery(criteriaQuery).getSingleResult();

			/*
			 * final CriteriaQuery<User> criteriaQuery =
			 * em.getCriteriaBuilder().createQuery(User.class); Root<User> c=
			 * criteriaQuery.from(User.class);
			 * criteriaQuery.select(c).where(em.getCriteriaBuilder().and(
			 * em.getCriteriaBuilder().equal(c.get("deleted"),false),
			 * em.getCriteriaBuilder().equal(c.get("token"),token)));
			 * 
			 * return em.createQuery(criteriaQuery).getSingleResult();
			 */

			/*
			 * Object userobj =
			 * em.createNamedQuery("User.findUserByToken").setParameter("token",
			 * token).getSingleResult();
			 * 
			 * return (User) userobj;
			 */

		} catch (NoResultException e) {

			return null;
		}
	}

	// método para listar todos os admins
	public List<User> listAllAdmins() {

		try {

			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);
			Root<User> u = criteriaQuery.from(User.class);

			criteriaQuery.select(u)
					.where(em.getCriteriaBuilder().and(em.getCriteriaBuilder().equal(u.get("type"), Type.admin)));

			return em.createQuery(criteriaQuery).getResultList();


		} catch (Exception e) {

			return null;
		}
	}
	
	//método para devolver uma lista de utilizadores que estão aprovados
	public List<User> listMembersAndAdmins() {
		
		try {
			
			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);

			Root<User> u = criteriaQuery.from(User.class);

			criteriaQuery.select(u)
					.where(em.getCriteriaBuilder().equal(u.get("approved"), true));

			return em.createQuery(criteriaQuery).getResultList();
			
		} catch(Exception e) {
			return null;
		}
	}
	
	//método para devolver uma lista de utilizadores que estão aprovados
		public List<User> listAvailableUsers(String username) {
			
			try {
				
				final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);

				Root<User> u = criteriaQuery.from(User.class);

				criteriaQuery.select(u)
						.where(em.getCriteriaBuilder().and(
								em.getCriteriaBuilder().equal(u.get("approved"), true), 
								em.getCriteriaBuilder().notEqual(u.get("username"), username)));

				return em.createQuery(criteriaQuery).getResultList();
				
			} catch(Exception e) {
				return null;
			}
		}

	// método para encontrar o utilizador através da sua informação de login
	// (username e password)
	public Object findByUserInfo(String username, String password) {

		try {

			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);

			Root<User> u = criteriaQuery.from(User.class);

			criteriaQuery.select(u)
					.where(em.getCriteriaBuilder().and(em.getCriteriaBuilder().equal(u.get("username"), username),
							em.getCriteriaBuilder().equal(u.get("password"), password)));

			return em.createQuery(criteriaQuery).getSingleResult();

			// Object result = em.createNamedQuery("User.findUser").setParameter("username",
			// username)
			// .setParameter("password", password).getSingleResult();
			// return null;

		} catch (Exception e) {
			return null;
		}

	}
	
	public Long totalNumberOfRegisteredUsers() {
		//https://stackoverflow.com/questions/2883887/in-jpa-2-using-a-criteriaquery-how-to-count-results
		try {
			
			CriteriaQuery<Long> cq = em.getCriteriaBuilder().createQuery(Long.class);
			cq.select(em.getCriteriaBuilder().count(cq.from(User.class)));
			return em.createQuery(cq).getSingleResult();
			/*final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);
			criteriaQuery.select(criteriaQuery.from(User.class));
			return em.createQuery(criteriaQuery).getResultList().size();*/
		}catch(Exception e) {
			return null;
		}
	}
	
	public List<User> listUnapprovedUsers(){
		try {
			
			final CriteriaQuery<User> criteriaQuery = em.getCriteriaBuilder().createQuery(User.class);
			
			Root<User> u = criteriaQuery.from(User.class);

			criteriaQuery.select(u)
					.where(em.getCriteriaBuilder().equal(u.get("approved"), false));

			return em.createQuery(criteriaQuery).getResultList();
			
		} catch(Exception e) {
			return null;
		}
	}
}
